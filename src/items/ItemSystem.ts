/**
 * ItemSystem - Manages item spawns and effects.
 * Supports Mario Kart-style item paradigms:
 * - Single use (MUSHROOM, SHELL, BANANA)
 * - Pack of 3 (MUSHROOM_TRIPLE, SHELL_TRIPLE, BANANA_TRIPLE)
 * - Duration-based (MUSHROOM_GOLDEN, STAR, BULLET, GHOST)
 * - Instant AoE (LIGHTNING)
 */

// Import helper functions from Item module
// Note: In our concatenated build, these are available globally

interface ItemBoxData {
  x: number;
  z: number;
  respawnTime: number;
}

/**
 * Debug configuration for testing specific items.
 * Change forceItem to test specific items, or set to null for normal random distribution.
 * 
 * Options: null, ItemType.MUSHROOM, ItemType.GREEN_SHELL, ItemType.RED_SHELL, ItemType.BLUE_SHELL,
 *          ItemType.BANANA, ItemType.STAR, ItemType.BULLET, ItemType.GHOST, ItemType.LIGHTNING
 */
var DEBUG_FORCE_ITEM: ItemType | null = null;  // <-- CHANGE THIS TO TEST

class ItemSystem {
  private items: Item[];
  private projectiles: IProjectile[];

  constructor() {
    this.items = [];
    this.projectiles = [];
  }

  /**
   * Initialize item boxes from track data.
   */
  initFromTrack(_track: ITrack, road: Road): void {
    this.items = [];  // Clear existing items
    
    // Get track length and distribute item boxes evenly
    var trackLength = road.totalLength;
    var numBoxes = Math.max(5, Math.floor(trackLength / 300));  // One box every ~300 units
    var spacing = trackLength / (numBoxes + 1);
    
    // Place item boxes at regular intervals
    for (var i = 1; i <= numBoxes; i++) {
      var z = spacing * i;
      
      // Alternate between center, left, and right sides of road
      // x values: 0 = center, negative = left, positive = right
      // playerX range is -1 to 1, scaled by 20, so road is -20 to +20
      var side = i % 3;
      var x = side === 0 ? 0 : (side === 1 ? -8 : 8);
      
      var item = new Item(ItemType.NONE);
      item.x = x;
      item.z = z;
      item.respawnTime = 8;  // Respawn after 8 seconds
      this.items.push(item);
    }
    
    logInfo("ItemSystem: Placed " + numBoxes + " item boxes across track length " + trackLength);
  }

  /**
   * Update all items (respawn timers, projectiles).
   */
  update(dt: number, vehicles?: IVehicle[], roadLength?: number): void {
    // Update respawn timers
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].updateRespawn(dt);
    }

    // Update shells (projectiles)
    if (vehicles && roadLength) {
      for (var j = this.projectiles.length - 1; j >= 0; j--) {
        var shell = this.projectiles[j] as Shell;
        if (shell.update(dt, vehicles, roadLength)) {
          // Shell should be removed
          this.projectiles.splice(j, 1);
        }
      }
    }
  }
  
  /**
   * Get active projectiles for rendering.
   */
  getProjectiles(): IProjectile[] {
    return this.projectiles;
  }

  /**
   * Check for vehicle-item collisions.
   */
  checkPickups(vehicles: IVehicle[]): void {
    for (var i = 0; i < vehicles.length; i++) {
      var vehicle = vehicles[i];
      if (vehicle.heldItem !== null) continue;  // Already holding an item

      for (var j = 0; j < this.items.length; j++) {
        var item = this.items[j];
        if (!item.isAvailable()) continue;

        // Distance check using track coordinates
        var dx = vehicle.x - item.x;
        var dz = vehicle.trackZ - item.z;
        
        // Pickup radius: ~15 units lateral, ~20 units along track
        if (Math.abs(dx) < 15 && Math.abs(dz) < 20) {
          // Pickup!
          item.pickup();
          var itemType = this.randomItemType(vehicle.racePosition, vehicles.length);
          vehicle.heldItem = {
            type: itemType,
            uses: getItemUses(itemType),
            activated: false
          };
          logInfo("Vehicle picked up " + ItemType[itemType] + " (x" + vehicle.heldItem.uses + ")");
        }
      }
    }
  }

  /**
   * Use a vehicle's held item.
   * @param vehicle - The vehicle using the item
   * @param allVehicles - All vehicles (for targeting/collision)
   * @param fireBackward - If true, fire projectiles backward (for green shells)
   */
  useItem(vehicle: IVehicle, allVehicles?: IVehicle[], fireBackward?: boolean): void {
    if (vehicle.heldItem === null) return;
    
    var itemType = vehicle.heldItem.type;
    var consumed = false;

    switch (itemType) {
      // Single-use boost items
      case ItemType.MUSHROOM:
      case ItemType.MUSHROOM_TRIPLE:
        Mushroom.applyEffect(vehicle);
        consumed = true;
        break;
        
      // Golden Mushroom - stays in slot, unlimited uses during duration
      case ItemType.MUSHROOM_GOLDEN:
        if (!vehicle.heldItem.activated) {
          // First use: activate the item and start duration timer
          vehicle.heldItem.activated = true;
          this.applyDurationEffect(vehicle, itemType);
          logInfo("Golden Mushroom ACTIVATED - unlimited boosts for duration!");
        }
        // Every use (including first): apply boost effect
        Mushroom.applyEffect(vehicle);
        // Item stays in slot until effect expires (handled by onEffectExpired)
        return;
        
      // Star - clears from slot, can pick up new items while invincible
      case ItemType.STAR:
        this.applyDurationEffect(vehicle, itemType);
        vehicle.heldItem = null;  // Clear slot, can pick up new items
        return;
        
      // Lightning - instant use, clears slot, visual feedback on user
      case ItemType.LIGHTNING:
        if (allVehicles) {
          this.applyLightning(vehicle, allVehicles);
          // Give the user a brief flash to show lightning was used
          vehicle.flashTimer = 0.3;
        }
        vehicle.heldItem = null;
        return;
        
      // Bullet - stays in slot while active, autopilot + speed + invincibility
      case ItemType.BULLET:
        if (!vehicle.heldItem.activated) {
          vehicle.heldItem.activated = true;
          this.applyDurationEffect(vehicle, itemType);
          logInfo("Bullet Bill ACTIVATED - autopilot engaged!");
        }
        // Item stays in slot until effect expires
        return;
        
      // Green Shells - fire straight (forward or backward based on last input)
      case ItemType.GREEN_SHELL:
      case ItemType.GREEN_SHELL_TRIPLE:
        {
          var greenShell = Shell.fireGreen(vehicle, fireBackward === true);
          this.projectiles.push(greenShell);
        }
        consumed = true;
        break;
        
      // Red Shells - fire homing to next vehicle ahead
      case ItemType.RED_SHELL:
      case ItemType.RED_SHELL_TRIPLE:
      case ItemType.SHELL:       // Legacy
      case ItemType.SHELL_TRIPLE: // Legacy
        if (allVehicles) {
          var redShell = Shell.fireRed(vehicle, allVehicles);
          this.projectiles.push(redShell);
        }
        consumed = true;
        break;
        
      // Blue Shell - fire homing to 1st place
      case ItemType.BLUE_SHELL:
        if (allVehicles) {
          var blueShell = Shell.fireBlue(vehicle, allVehicles);
          this.projectiles.push(blueShell);
        }
        consumed = true;
        break;
        
      // Bananas - drop hazard behind vehicle
      case ItemType.BANANA:
      case ItemType.BANANA_TRIPLE:
        {
          var banana = Banana.drop(vehicle);
          this.projectiles.push(banana);
        }
        consumed = true;
        break;
    }

    // Handle uses for pack items
    if (consumed && vehicle.heldItem) {
      vehicle.heldItem.uses--;
      if (vehicle.heldItem.uses <= 0) {
        vehicle.heldItem = null;
      }
    }
  }
  
  /**
   * Apply a duration-based effect to a vehicle.
   */
  private applyDurationEffect(vehicle: IVehicle, type: ItemType): void {
    var duration = getItemDuration(type);
    (vehicle as Vehicle).addEffect(type, duration, vehicle.id);
    
    // Lock in minimum speed to prevent deceleration from key handling issues
    vehicle.boostMinSpeed = Math.max(vehicle.speed, VEHICLE_PHYSICS.MAX_SPEED * 0.5);
    
    // Apply immediate effects
    switch (type) {
      case ItemType.MUSHROOM_GOLDEN:
        vehicle.boostMultiplier = 1.4;
        // Immediate speed bump
        vehicle.speed = Math.min(vehicle.speed * 1.2, VEHICLE_PHYSICS.MAX_SPEED * 1.4);
        break;
      case ItemType.STAR:
        vehicle.boostMultiplier = 1.35;
        vehicle.speed = Math.min(vehicle.speed * 1.25, VEHICLE_PHYSICS.MAX_SPEED * 1.35);
        break;
      case ItemType.BULLET:
        // Bullet is the fastest item - 1.6x max speed, locks to max immediately
        vehicle.boostMultiplier = 1.6;
        vehicle.speed = VEHICLE_PHYSICS.MAX_SPEED * 1.6;  // Instant max speed
        vehicle.boostMinSpeed = VEHICLE_PHYSICS.MAX_SPEED * 1.5;  // High minimum
        break;
    }
    
    logInfo("Applied " + ItemType[type] + " effect for " + duration + "s, minSpeed: " + vehicle.boostMinSpeed);
  }
  
  /**
   * Apply lightning effect to opponents ahead of the user in race position.
   * Does not affect: the user, anyone behind them in race position, or invincible players.
   */
  private applyLightning(user: IVehicle, allVehicles: IVehicle[]): void {
    var duration = getItemDuration(ItemType.LIGHTNING);
    var hitCount = 0;
    
    for (var i = 0; i < allVehicles.length; i++) {
      var v = allVehicles[i] as Vehicle;
      if (v.id === user.id) continue;  // Don't affect self
      
      // Only affect racers AHEAD of the user in RACE POSITION (lower position number = ahead)
      // e.g., if user is in 5th place, hit positions 1-4
      if (v.racePosition >= user.racePosition) continue;
      
      // Check for immunity: Star or Bullet
      if (v.hasEffect && (
          v.hasEffect(ItemType.STAR) || 
          v.hasEffect(ItemType.BULLET))) {
        continue;
      }
      
      v.addEffect(ItemType.LIGHTNING, duration, user.id);
      hitCount++;
    }
    logInfo("Lightning struck " + hitCount + " opponents ahead (positions 1-" + (user.racePosition - 1) + ")!");
  }

  /**
   * Get random item type (weighted by race position).
   * Implements rubber-banding: leaders get weak items, trailing players get powerful items.
   * Based on Mario Kart item distribution system.
   * Can be overridden by DEBUG_FORCE_ITEM constant for testing.
   */
  private randomItemType(position: number, totalRacers: number): ItemType {
    // Debug override - force specific item for testing
    if (DEBUG_FORCE_ITEM !== null) {
      return DEBUG_FORCE_ITEM;
    }
    
    var roll = globalRand.next();
    
    // Position factor: 0 = first place, 1 = last place
    var positionFactor = totalRacers > 1 ? (position - 1) / (totalRacers - 1) : 0;
    
    // 1st-2nd place (top 25%): Weak defensive items only
    if (positionFactor < 0.25) {
      if (roll < 0.40) return ItemType.BANANA;         // 40% - Defensive
      if (roll < 0.70) return ItemType.GREEN_SHELL;    // 30% - Offensive but not homing
      if (roll < 0.85) return ItemType.MUSHROOM;       // 15% - Small boost
      if (roll < 0.95) return ItemType.RED_SHELL;      // 10% - Homing for defense
      return ItemType.BANANA_TRIPLE;                   //  5% - Triple banana
    }
    // Upper-mid pack (25-50%): Balanced items
    else if (positionFactor < 0.50) {
      if (roll < 0.25) return ItemType.MUSHROOM;           // 25% - Speed boost
      if (roll < 0.45) return ItemType.GREEN_SHELL;        // 20% - Projectile
      if (roll < 0.65) return ItemType.RED_SHELL;          // 20% - Homing shell
      if (roll < 0.80) return ItemType.BANANA;             // 15% - Hazard
      if (roll < 0.90) return ItemType.MUSHROOM_TRIPLE;    // 10% - Triple boost
      return ItemType.GREEN_SHELL_TRIPLE;                  // 10% - Triple shells
    }
    // Lower-mid pack (50-75%): Strong offensive items
    else if (positionFactor < 0.75) {
      if (roll < 0.20) return ItemType.MUSHROOM_TRIPLE;    // 20% - Triple boost
      if (roll < 0.35) return ItemType.RED_SHELL;          // 15% - Homing
      if (roll < 0.50) return ItemType.RED_SHELL_TRIPLE;   // 15% - Triple homing
      if (roll < 0.65) return ItemType.MUSHROOM_GOLDEN;    // 15% - Unlimited boost
      if (roll < 0.80) return ItemType.STAR;               // 15% - Invincibility
      if (roll < 0.90) return ItemType.LIGHTNING;          // 10% - Hit leaders
      return ItemType.MUSHROOM_GOLDEN;                     // 10% - More golden mushrooms
    }
    // Last place (bottom 25%): Most powerful catch-up items
    else {
      if (roll < 0.20) return ItemType.MUSHROOM_GOLDEN;    // 20% - Unlimited boost
      if (roll < 0.40) return ItemType.STAR;               // 20% - Invincibility
      if (roll < 0.55) return ItemType.BULLET;             // 15% - Max speed autopilot
      if (roll < 0.70) return ItemType.LIGHTNING;          // 15% - Slow all ahead
      if (roll < 0.80) return ItemType.BLUE_SHELL;         // 10% - Hit 1st place
      if (roll < 0.90) return ItemType.RED_SHELL_TRIPLE;   // 10% - Triple homing
      return ItemType.MUSHROOM_GOLDEN;                     // 10% - More golden mushrooms
    }
  }

  /**
   * Get all item boxes for rendering.
   */
  getItemBoxes(): Item[] {
    return this.items;
  }
}

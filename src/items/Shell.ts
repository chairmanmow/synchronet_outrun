/**
 * Shell - Projectile items using vehicle-like track behavior.
 * 
 * Shells travel along the track like high-speed vehicles:
 * - RED SHELL: Homes toward next vehicle ahead
 * - GREEN SHELL: Travels straight at fixed lateral position
 * - BLUE SHELL: Homes toward 1st place vehicle
 * 
 * This reuses our pseudo-3D track system instead of true projectile physics.
 */

/** Shell types */
enum ShellType {
  GREEN = 0,  // Straight path, can hit anyone
  RED = 1,    // Homes to next vehicle ahead
  BLUE = 2    // Homes to 1st place
}

interface IProjectile extends IEntity {
  /** Shell type (green/red/blue) */
  shellType: ShellType;

  /** Track position (like vehicle.trackZ) */
  trackZ: number;

  /** Lateral position (like vehicle.playerX) */
  playerX: number;

  /** Movement speed along track */
  speed: number;

  /** ID of vehicle that fired this */
  ownerId: number;

  /** Target vehicle ID (for homing shells) */
  targetId: number;

  /** Time to live (despawn timer) */
  ttl: number;

  /** Has this shell hit something? */
  isDestroyed: boolean;
}

class Shell extends Item implements IProjectile {
  shellType: ShellType;
  trackZ: number;
  playerX: number;
  speed: number;
  ownerId: number;
  targetId: number;
  ttl: number;
  isDestroyed: boolean;

  constructor(shellType: ShellType) {
    super(ItemType.SHELL);
    this.shellType = shellType;
    this.trackZ = 0;
    this.playerX = 0;
    this.speed = 500;  // Faster than vehicles
    this.ownerId = -1;
    this.targetId = -1;
    this.ttl = 10;  // 10 seconds max lifetime
    this.isDestroyed = false;
  }

  /**
   * Fire a green shell (straight ahead).
   * Speed is based on vehicle speed + boost (always faster than the firer).
   */
  static fireGreen(vehicle: IVehicle): Shell {
    var shell = new Shell(ShellType.GREEN);
    shell.trackZ = vehicle.trackZ + 15;  // Start slightly ahead
    shell.playerX = vehicle.playerX;      // Same lateral position
    shell.ownerId = vehicle.id;
    // Shell is always faster than the vehicle: base speed + 100, minimum 200
    shell.speed = Math.max(200, vehicle.speed + 100);
    logInfo("GREEN SHELL fired at speed=" + shell.speed.toFixed(0) + " from playerX=" + shell.playerX.toFixed(2));
    return shell;
  }

  /**
   * Fire a red shell (homes to next vehicle ahead).
   * Slightly slower than green but homes to target.
   */
  static fireRed(vehicle: IVehicle, vehicles: IVehicle[]): Shell {
    var shell = new Shell(ShellType.RED);
    shell.trackZ = vehicle.trackZ + 15;
    shell.playerX = vehicle.playerX;
    shell.ownerId = vehicle.id;
    // Red shell: vehicle speed + 80, minimum 180 (slightly slower than green but homes)
    shell.speed = Math.max(180, vehicle.speed + 80);
    
    // Find next vehicle ahead
    shell.targetId = Shell.findNextVehicleAhead(vehicle, vehicles);
    logInfo("RED SHELL fired at speed=" + shell.speed.toFixed(0) + ", target=" + shell.targetId);
    return shell;
  }

  /**
   * Fire a blue shell (homes to 1st place).
   * Very fast - needs to catch up to leader from anywhere on track.
   * Does not despawn until hitting 1st place.
   */
  static fireBlue(vehicle: IVehicle, vehicles: IVehicle[]): Shell {
    var shell = new Shell(ShellType.BLUE);
    shell.trackZ = vehicle.trackZ + 15;
    shell.playerX = vehicle.playerX;
    shell.ownerId = vehicle.id;
    // Blue shell: ~3x max vehicle speed to guarantee it catches leader
    shell.speed = 900;
    
    // Find 1st place vehicle
    shell.targetId = Shell.findFirstPlace(vehicles);
    logInfo("BLUE SHELL fired at speed=" + shell.speed.toFixed(0) + ", target=" + shell.targetId);
    return shell;
  }

  /**
   * Find the next vehicle ahead of the shooter.
   */
  static findNextVehicleAhead(shooter: IVehicle, vehicles: IVehicle[]): number {
    var bestId = -1;
    var bestDist = Infinity;
    
    for (var i = 0; i < vehicles.length; i++) {
      var v = vehicles[i];
      if (v.id === shooter.id) continue;
      
      // Must be ahead (higher trackZ, accounting for lap wrapping)
      var dist = v.trackZ - shooter.trackZ;
      if (dist > 0 && dist < bestDist) {
        bestDist = dist;
        bestId = v.id;
      }
    }
    return bestId;
  }

  /**
   * Find the vehicle in 1st place.
   */
  static findFirstPlace(vehicles: IVehicle[]): number {
    for (var i = 0; i < vehicles.length; i++) {
      if (vehicles[i].racePosition === 1) {
        return vehicles[i].id;
      }
    }
    return -1;
  }

  /**
   * Update shell position and check for hits.
   * Returns true if shell should be removed.
   */
  update(dt: number, vehicles: IVehicle[], roadLength: number): boolean {
    if (this.isDestroyed) return true;
    
    // Decrease TTL (but blue shells never despawn on timeout)
    this.ttl -= dt;
    if (this.ttl <= 0 && this.shellType !== ShellType.BLUE) {
      logInfo("Shell despawned (TTL)");
      return true;
    }
    
    // Move forward along track
    this.trackZ += this.speed * dt;
    
    // Wrap around track
    if (this.trackZ >= roadLength) {
      this.trackZ = this.trackZ % roadLength;
    }
    
    // Homing behavior for red/blue shells
    if (this.shellType === ShellType.RED || this.shellType === ShellType.BLUE) {
      var target = this.findVehicleById(vehicles, this.targetId);
      if (target) {
        // Steer toward target's lateral position
        var homingRate = 2.0;  // How fast we home in
        if (this.playerX < target.playerX - 0.05) {
          this.playerX += homingRate * dt;
        } else if (this.playerX > target.playerX + 0.05) {
          this.playerX -= homingRate * dt;
        }
      } else {
        // Target gone, convert to straight path
        this.shellType = ShellType.GREEN;
      }
    }
    
    // Check for collisions with vehicles
    for (var i = 0; i < vehicles.length; i++) {
      var v = vehicles[i];
      if (v.id === this.ownerId) continue;  // Can't hit self
      if (v.isCrashed) continue;  // Already crashed
      
      // Check for invincibility (Star or Bullet)
      var isInvincible = false;
      for (var e = 0; e < v.activeEffects.length; e++) {
        var effectType = v.activeEffects[e].type;
        if (effectType === ItemType.STAR || effectType === ItemType.BULLET) {
          isInvincible = true;
          break;
        }
      }
      if (isInvincible) continue;  // Invincible - shell passes through harmlessly
      
      // Check collision (similar to vehicle-vehicle)
      var latDist = Math.abs(this.playerX - v.playerX);
      var longDist = Math.abs(this.trackZ - v.trackZ);
      
      if (latDist < 0.5 && longDist < 15) {
        // HIT!
        this.applyHitToVehicle(v);
        this.isDestroyed = true;
        return true;
      }
    }
    
    return false;
  }

  /**
   * Find vehicle by ID.
   */
  private findVehicleById(vehicles: IVehicle[], id: number): IVehicle | null {
    for (var i = 0; i < vehicles.length; i++) {
      if (vehicles[i].id === id) return vehicles[i];
    }
    return null;
  }

  /**
   * Apply shell hit effect to a vehicle.
   * Knocks vehicle to edge of road at 0 mph - must accelerate and steer back.
   */
  private applyHitToVehicle(vehicle: IVehicle): void {
    // Full stop - dramatic impact
    vehicle.speed = 0;
    
    // Knock to side of road (but stay ON the road, not off it)
    // playerX range: -1.0 to +1.0 is on-road, so knock to ±0.7 to ±0.9
    var knockDirection = vehicle.playerX >= 0 ? 1 : -1;  // Knock in direction already moving
    vehicle.playerX = knockDirection * (0.7 + Math.random() * 0.2);  // 0.7 to 0.9
    
    // Longer flash for more dramatic visual feedback
    vehicle.flashTimer = 1.5;
    
    var shellNames = ['GREEN', 'RED', 'BLUE'];
    logInfo(shellNames[this.shellType] + " SHELL hit vehicle " + vehicle.id + " - knocked to edge at playerX=" + vehicle.playerX.toFixed(2) + "!");
  }
}


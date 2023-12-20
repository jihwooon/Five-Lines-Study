export enum RawTrafficLight {
    RED,
    YELLOW,
    GREEN
}
class Car {
    stop(): boolean {
      return false;
    }
  
    drive(): boolean {
      return true;
    }
  }
const car = new Car();
export interface TrafficLight{
    isRed() : boolean,
    isYellow() : boolean,
    isGreen() : boolean,
    updateCar() : void
}

export class Red implements TrafficLight{
    isRed(){return true;}
    isYellow(){return false;}
    isGreen(){return false;}
    updateCar(){car.stop();};
}

export class Yellow implements TrafficLight{
    isRed(){return false;}
    isYellow(){return true;}
    isGreen(){return false;}
    updateCar(){car.drive()};
}

export class Green implements TrafficLight{
    isRed(){return false;}
    isYellow(){return false;}
    isGreen(){return true;}
    updateCar(){car.drive()};
}

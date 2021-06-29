export interface PropertyList {
    GetPropertyListJsonResult : Value;
}

export interface Value{
    Value : Items;
}

export interface Items{
    Items : Property[];
}

export interface Property {
    GetPropertyListJsonResult : any;
    Status : number;
    Goal : number;
    City : string;
    ID: number;
    TypeDescription: string;
    Zip: number;
    LargePicture: string;
    LargePictures: string[];
    StartPrice: number;
    Price: number;
    MainTypeName: string;
    SurfaceTotal: number;
    SurfaceGarden: number;
    HasGarden: boolean;
    EnergyPerformance: number;
    KitchenName: string;
    WindowGlazing: string;
    OrientationT: string;
    MainStyleName: string;
    HasLift: boolean;
    Floor: number;
    ConstructionYear: number;
    SurfaceTerrace: number;
    ConstructionName: string;
    DescriptionA: string;
    DescriptionB: string
    NumberOfBedRooms: number;
    NumberOfBathRooms: number;
    NumberOfShowerRooms: number;
    NumberOfGarages: number;
    HeatingName: string;
    ConditionName: string;
    GoogleX: number;
    GoogleY: number;
    PriceUnitText: string;
    MarqueeName: string;
    Marquee: number;
    MarqueeShowOrder: number;
    VirtualTour: string;
    IsOffice: boolean;
}

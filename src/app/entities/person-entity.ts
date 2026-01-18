import { Entity } from "./entity";

class PersonEntity extends Entity {
    private name: string = "";

    private document: string = "";

    private birthDate: number = Date.now();

    public constructor(id?: string) {
        super("person", id);
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setDocument(document: string): void {
        this.document = document;
    }

    public setBirthDate(birthDate: number): void {
        this.birthDate = birthDate;
    }

    public getName(): string {
        return this.name;
    }

    public getDocument(): string {
        return this.document;
    }

    public getBirthDate(): number {
        return this.birthDate;
    }
}

export { PersonEntity };

import { Entity } from "../../src"
import { Property } from "../../src/decorators/Property"
import { BaseEntity } from "../../src/repository/BaseEntity"

@Entity({ name: "test", type: "HASH" })
export class Test extends BaseEntity {
    @Property({ type: "text" })
    test!: string
}

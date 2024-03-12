import { Entity } from "../../src"
import { Property } from "../../src/decorators/Property"
import { BaseEntity } from "../../src/repository/BaseEntity"

@Entity({ name: "user", type: "HASH" })
export class User extends BaseEntity {
    @Property({ type: "tag" })
    id!: string

    @Property({ type: "tag" })
    name!: string

    @Property({ type: "numeric" })
    age!: number
}

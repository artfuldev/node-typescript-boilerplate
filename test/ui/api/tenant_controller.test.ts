import bcrypt from "bcrypt";
import { expect } from "chai";
import httpStatus from "http-status-codes";
import supertest from "supertest";

import app = require("../../../src");
import { TYPES } from "../../../src/domain/constants/types";
import {
    ITenantRepository,
    IUserRepository
} from "../../../src/domain/interfaces/repositories";
import Tenant from "../../../src/domain/model/tenant";
import { User, UserRole } from "../../../src/domain/model/user";
import config from "../../../src/infrastructure/config";
import { container } from "../../../src/infrastructure/utils/ioc_container";
import { IAuthService } from "../../../src/ui/interfaces/auth_service";
import { CreateTenantInput } from "../../../src/ui/models/tenant_dto";

const endpoint = `${config.api.prefix}/tenants`;
let authService: IAuthService;
let userRepository: IUserRepository;
let tenantRepository: ITenantRepository;
describe("Tenant controller", async () => {
    const password = "dadf_jad63A";
    let user: User;
    let jwtToken: string;

    let req: supertest.SuperTest<supertest.Test>;
    let tenant: Tenant;
    before(async () => {
        userRepository = container.get<IUserRepository>(TYPES.UserRepository);
        authService = container.get<IAuthService>(TYPES.AuthService);
        tenantRepository = container.get<ITenantRepository>(
            TYPES.TenantRepository
        );
        tenant = await tenantRepository.findOneByQuery({ name: "Default" });
        const hashedPw = await bcrypt.hash(password, 1);
        user = User.createInstance({
            firstName: "Admin",
            lastName: "Admin",
            email: "admin@gmail.com",
            password: hashedPw,
            username: "admin",
            tenantId: tenant.id
        });
        user.setRole(UserRole.ADMIN);
        await userRepository.save(user);
        const { token } = await authService.signIn({
            password: password,
            emailOrUsername: user.username
        });
        jwtToken = token;
        req = supertest(app.appServer);
    });
    const createTenantInput: CreateTenantInput = {
        name: "NewTenant",
        description: "New tenant"
    };

    it("should create new tenant and return tenant DTO object", async () => {
        const res = await req
            .post(endpoint)
            .set("X-AUTH-TOKEN", jwtToken)
            .send(createTenantInput)
            .expect(httpStatus.OK);

        expect(res.body).to.contain.keys("name", "id", "description");
    });
    it("should return list of tenants", async () => {
        const res = await req.get(endpoint).expect(httpStatus.OK);
        expect(res.body).to.be.an("array");
    });
    it("should return tenant object when queried by tenant name", async () => {
        const res = await req
            .get(endpoint)
            .query({ name: tenant.name })
            .expect(httpStatus.OK);
        expect(res.body).to.contain.keys("isActive", "id", "name");
    });
});
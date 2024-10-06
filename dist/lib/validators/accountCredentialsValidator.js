"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidationSchema = void 0;
var zod_1 = require("zod");
exports.AuthValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Must be a valid email address" }),
    password: zod_1.z.string().min(8, { message: "Password must be at least 8 characters" }),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
exports.Users = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                return "<a href='".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token, "'>Verify Your Email</a>");
            },
        },
    },
    access: {
        read: function () { return true; },
        create: function () { return true; },
    },
    fields: [
        {
            name: "role",
            type: "select",
            required: true,
            defaultValue: "user",
            options: [
                {
                    value: "admin",
                    label: "Admin",
                },
                {
                    value: "user",
                    label: "User",
                },
            ],
        },
    ],
};

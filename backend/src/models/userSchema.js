import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: [3, "Name must contain at least 3 characters"],
            maxLength: [32, "Name can contain only up to 32 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is needed"],
            validate: {
                validator: (value) => validator.isEmail(value),
                message: "Please provide a valid email",
            },
        },
        phone: {
            type: String,
            required: true,
            validate: {
                validator: (value) => validator.isMobilePhone(value, "any"),
                message: "Please provide a valid phone number",
            },
        },
        avatar: {
            public_id: { type: String, 
                required:true,
            },
            url: { type: String, 
                required:true,
            },
        },
        education: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: {
                values: ["Reader", "Author"],
                message: "Role must be either 'Reader' or 'Author'",
            },
        },
        password: {
            type: String,
            required: true,
            minLength: [8, "Password must contain at least 8 characters"],
            maxLength: [32, "Password cannot exceed 32 characters"],
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

userSchema.methods.isPasswordCorrect = async function (inputPassword) 
{
    console.log(this.password)
    if (!inputPassword) {
        throw new Error("Password input is missing");
    }
    if (!this.password) {
        throw new Error("Stored password is missing");
    }
    return bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
}


userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);

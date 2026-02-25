import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const avatarlinks = [
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Felix',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Charlie',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Max',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Buddy',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Rocky',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Jack',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Sophie',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Luna',
    'https://api.dicebear.com/9.x/thumbs/svg?seed=Lucy',
];
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // This creates an index, just like a UNIQUE constraint in SQL
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: String,
        default: function() {
            return avatarlinks[Math.floor(Math.random() * avatarlinks.length)];
        }
    },
    bio: {
        type: String,
        default: 'Welcome to Webify! Update your bio in settings.'
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    }
});

// Hash password before saving
UserSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    const isBcryptHash = /^\$2[ayb]\$.{56}$/.test(this.password);

    if (isBcryptHash) {
        // Use bcrypt for hashed passwords
        return await bcrypt.compare(candidatePassword, this.password);
    } else {
        // Plain text comparison for old passwords
        return this.password === candidatePassword;
    }
};

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function () {
    // Generate random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and save to database
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set token expiry (10 minutes)
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    // Return unhashed token (this will be sent in email)
    return resetToken;
};

// Static method to find user by valid reset token
UserSchema.statics.findByPasswordResetToken = function (token) {
    // Hash the token to compare with stored hashed version
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    return this.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
};

// Method to generate email verification token
UserSchema.methods.generateEmailVerificationToken = function () {
    // Generate random token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and save to database
    this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    
    // Set token expiry (24 hours)
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    
    // Return unhashed token (this will be sent in email)
    return verificationToken;
};

// Static method to find user by valid verification token
UserSchema.statics.findByEmailVerificationToken = function (token) {
    // Hash the token to compare with stored hashed version
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    return this.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() }
    });
};

// The first argument 'User' is the name of the collection (it will become 'users' in Atlas)
const User = mongoose.model('User', UserSchema);

export default User;
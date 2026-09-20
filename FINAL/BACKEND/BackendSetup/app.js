
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());


const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';
mongoose.connect(dbURI).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// --- SCHEMAS & MODELS ---

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const Post = mongoose.model('Post', postSchema);



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[ 1]; // "Bearer TOKEN"

    if (!token) return res.status(401).json({ error: "Access token required" });

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token" });
        req.user = user;
        next();
    });
};


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PostIts Blog API',
            version: '1.0.0',
            description: 'API documentation for the blog engine application',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./app.js'], 
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.post('/auth/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: "Credentials required" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/posts',  async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.body,
            author: req.body.author, 
            category: req.body.category
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get('/posts', async (req, res) => {
    try {
      
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

       
        let queryCondition = {};
        if (req.query.category) {
            queryCondition.category = req.query.category;
        }
        if (req.query.search) {
            queryCondition.title = { $regex: req.query.search, $options: 'i' };
        }

        const posts = await Post.find(queryCondition)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments(queryCondition);

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalItems: totalPosts,
            data: posts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: "Invalid ID format or server error" });
    }
});


app.put('/posts/:id', async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id, 
            {
                title: req.body.title,
                content: req.body.body,
                category: req.body.category,
                author: req.body.author 
            },
            { new: true, runValidators: true }
        );
        if (!updatedPost) return res.status(404).json({ error: "Post not found" });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.delete('/posts/:id',  async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ error: "Post not found" });
        res.status(200).json({ message: "Post deleted successfully", deletedPost });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Glimpses of your thoughts, out for the world !');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

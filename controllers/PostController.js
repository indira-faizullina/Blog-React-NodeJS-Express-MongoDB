import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec()

        res.json(posts)
    }
    catch(err) {
        console.log(err)

        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        const post = await PostModel.findOneAndUpdate(
        {
            _id: postId,
        }, 
        {
            $inc: {
                viewsCount: 1,
            },
        },
        {
        returnDocument: 'after',
        },
    )

        if(!post) {
            return res.status(404).json({
            message: 'Не удалось получить статью'
        })
        }

        res.json(post)
    }
    catch(err) {
        console.log(err)

        res.status(500).json({
            message: 'Не удалось получить статью'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne(
        {
            _id: postId,
        }, 
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        }
    )

        res.status(200).json({
            message: 'success'
        })
    }
    catch(err) {
        console.log(err)

        res.status(500).json({
            message: 'Не удалось отредактировать статью'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await doc.save()

        res.json(post)
    }
    catch(err) {
        console.log(err)

        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

export const remove = async (req, res) => {

    try {
        const postId = req.params.id

        const post = await PostModel.findOneAndDelete({
            _id: postId
        })

        if(!post) {
            return res.status(404).json({
                message: 'Статья не найдена'
            })
        }

        return res.status(200).json({
            message: 'success'
        })
    }
    catch(err) {
        return res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    }
}
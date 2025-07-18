export default function injectSocket(io) {
    return (req, res, next) => {
        req.io = io;
        next();
    };
}

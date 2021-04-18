const generateMsg = ({username, text})=> {
    return{
        username,
        text,
        createdAt : new Date().getTime()
    }
}
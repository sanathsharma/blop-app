const message = ( prodMsg, devMsg ) => {
    return process.env.NODE_ENV === 'production' ? prodMsg : devMsg;
};

export default message;
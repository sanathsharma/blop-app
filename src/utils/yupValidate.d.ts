import { Schema } from 'yup';
declare type ObjectType = {
    [x: string]: any;
};
declare function yupValidate<T extends ObjectType> ( schema: Schema<T>, obj: T ): Promise<T>;
export default yupValidate;

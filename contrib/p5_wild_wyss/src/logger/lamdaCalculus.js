export {id, lazy, toChurchBoolean, convertToJsBool}

import {False, True} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus";

const id = x => x;
const lazy = x => () => x;
const toChurchBoolean = value => value ? True : False;
const convertToJsBool = b => b(true)(false);


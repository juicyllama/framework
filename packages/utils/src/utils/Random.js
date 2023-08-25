"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
const llama_facts_json_1 = __importDefault(require("../assets/llama.facts.json"));
class Random {
    static LlamaFact() {
        return llama_facts_json_1.default[Math.floor(Math.random() * llama_facts_json_1.default.length)];
    }
}
exports.Random = Random;

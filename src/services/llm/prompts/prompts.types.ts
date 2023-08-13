export type SchemaValue = string | PromptSchema;
export type PromptSchema = { [key: string]: SchemaValue };

export type Prompt = {
  content: string;
  role: string;
  model: string;
  id: string;
  schema?: PromptSchema;
};

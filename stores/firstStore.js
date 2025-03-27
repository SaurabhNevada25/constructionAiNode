import OpenAI from "openai";

const openai = new OpenAI({
  // apiKey: "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",
  apiKey: "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",
});

const vector_store_id = "vs_67e139cc15b48191a893fad88952080b";

export async function startRoute(users_question) {
  try {
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: [
        {
          "role": "system",
          "content": [
            {
              "type": "input_text",
              "text": "read the complete pdf(textfile that is uloaded in the vector with the specific vector store id provided) that i attached ,\
              it is related to the constructions of different properties change order documents , \
              so users are trying to do the construction management ,\
               so help users and answer the users question by reading the document added and give relavent and correct answer and \
               note that do not give answer outside the construction related. and give answer that the question is not related to construction if it is not related \
               ex: user : who is the prime minister of india? then ai_response : please ask related to construction managements"
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": users_question
            }
          ]
        }
      ],
      tools: [
        {
          "type": "file_search",
          "vector_store_ids": [vector_store_id],  // Use the vector store ID from previous step
        }
      ],
      temperature: 1,
      max_output_tokens: 2048,
      top_p: 1,
      store: true
    });
    return response.output_text;
  } catch (err) {
    throw err;
  }
}
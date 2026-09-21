use deepseek_recipe::openai::ChatCompletionRequest;
use deepseek_recipe::request::{ConversionOptions, ProtocolRequest};
use deepseek_recipe_encoding::PromptEncoding;
use deepseek_recipe_encoding::v4::dsv41::DeepseekV41Encoding;
use tokenizers::Tokenizer;

fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let args: Vec<String> = std::env::args().collect();
    if args.len() != 3 { return Err("expected request.json tokenizer.json".into()); }
    let request: ChatCompletionRequest = serde_json::from_slice(&std::fs::read(&args[1])?)?;
    let converted = request.convert(ConversionOptions::default())?;
    let encoding = DeepseekV41Encoding::new().with_tokenizer(Tokenizer::from_file(&args[2])?);
    let tokens = encoding.encode(&converted.conversation)?;
    println!("{}", serde_json::json!({"tokens": tokens.len()}));
    Ok(())
}

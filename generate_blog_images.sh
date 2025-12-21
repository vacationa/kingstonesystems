#!/bin/bash

# OpenAI API Key should be set as an environment variable
if [ -z "$OPENAI_API_KEY" ]; then
    echo "Error: OPENAI_API_KEY environment variable is not set"
    echo "Please set it with: export OPENAI_API_KEY='your-api-key-here'"
    exit 1
fi

API_KEY="$OPENAI_API_KEY"
OUTPUT_DIR="/Users/adhi/Repos/kingstonesystems/public/assets/blog"

mkdir -p "$OUTPUT_DIR"

POSTS=(
    "ai-voice-agent-services-for-businesses|AI Voice Agent Services for Business"
    "ai-voice-agents-for-law-firms|AI Voice Agents for Law Firms"
    "best-ai-voice-agent-solutions-for-business-phone-systems|AI Voice Agent for Phone Systems"
    "best-companies-for-outbound-call-agents-using-voice-ai|Outbound Voice AI Agents"
    "best-voice-ai-agents-for-telecom-and-utility-providers|Voice AI for Telecom and Utilities"
    "how-do-ai-chatbots-compare-to-human-agents|AI Chatbots vs Human Agents"
    "how-to-build-ai-agents|Building AI Agents"
    "how-to-control-emotional-tone-of-ai-agent-responses|AI Emotional Tone Control"
    "how-to-create-industry-specific-knowledge-bases-for-ai-agents|Industry Knowledge Bases for AI"
    "how-to-use-agentic-ai|Agentic AI Systems"
    "roi-ai-receptionist-education-training|ROI of AI Receptionist in Education"
    "roi-of-ai-receptionist-for-locksmiths|ROI of AI Receptionist for Locksmiths"
    "roi-of-ai-receptionist-for-realtors|ROI of AI Receptionist for Realtors"
    "roi-of-ai-receptionist-for-recruiting-hr|ROI of AI Receptionist for HR"
    "roi-of-an-ai-receptionist-for-construction|ROI of AI Receptionist for Construction"
    "the-roi-of-an-ai-receptionist-for-accounting-firms|ROI of AI Receptionist for Accountants"
    "the-roi-of-an-ai-receptionist-for-apartment-complexes|ROI of AI Receptionist for Apartments"
    "the-roi-of-an-ai-receptionist-for-b2b-saas|ROI of AI Receptionist for B2B SaaS"
    "the-roi-of-an-ai-receptionist-for-brokerages|ROI of AI Receptionist for Brokerages"
    "the-roi-of-an-ai-receptionist-for-consulting-firms|ROI of AI Receptionist for Consultants"
    "the-roi-of-an-ai-receptionist-for-family-law|ROI of AI Receptionist for Family Law"
    "the-roi-of-an-ai-receptionist-for-hospitality-and-travel|ROI of AI Receptionist for Travel"
    "the-roi-of-an-ai-receptionist-for-immigration-law|ROI of AI Receptionist for Immigration"
    "the-roi-of-an-ai-receptionist-for-landscaping|ROI of AI Receptionist for Landscaping"
    "the-roi-of-an-ai-receptionist-for-logistics-auto-field-ops|ROI of AI Receptionist for Logistics"
    "the-roi-of-an-ai-receptionist-for-personal-injury-law|ROI of AI Receptionist for Law"
    "the-roi-of-an-ai-receptionist-for-property-managers|ROI of AI Receptionist for Property Managers"
    "the-roi-of-an-ai-receptionist-for-real-estate-law|ROI of AI Receptionist for Real Estate Law"
    "the-roi-of-an-ai-receptionist-for-roofing|ROI of AI Receptionist for Roofing"
    "the-roi-of-an-ai-receptionist-for-short-term-rentals|ROI of AI Receptionist for Rentals"
    "why-voice-ai-will-replace-traditional-call-centers-in-2026|Future of AI Call Centers"
)

for post in "${POSTS[@]}"; do
    IFS="|" read -r filename topic <<< "$post"
    echo "Generating image for: $topic"
    
    PROMPT="Minimalist professional blog header image for '$topic'. Abstract tech design with clean geometric lines, glowing purple accents (#7F00FF) on a dark gray (#1F2937) background. 3D render style, sleek, modern, high definition, high quality, minimalist aesthetic."
    
    RESPONSE=$(curl -s https://api.openai.com/v1/images/generations \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $API_KEY" \
      -d "{
        \"model\": \"dall-e-3\",
        \"prompt\": \"$PROMPT\",
        \"n\": 1,
        \"size\": \"1024x1024\"
      }")
    
    IMAGE_URL=$(echo $RESPONSE | grep -oE '"url": *"[^"]+"' | cut -d'"' -f4)
    
    if [ -n "$IMAGE_URL" ]; then
        curl -s "$IMAGE_URL" -o "$OUTPUT_DIR/$filename.png"
        echo "Successfully saved $filename.png"
    else
        echo "Failed to generate image for $filename"
        echo "Response: $RESPONSE"
    fi
    
    # Sleep to avoid rate limiting
    sleep 2
done

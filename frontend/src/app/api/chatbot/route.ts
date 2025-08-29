import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, fileData } = await request.json();

    if (!message && !fileData) {
      return NextResponse.json({ error: "No message or file data provided" }, { status: 400 });
    }

    // Build the insurance claim analysis prompt
    const prompt = `System Role:
You are an expert Insurance Claim Validation Assistant. Your task is to analyze insurance claims for validity, fraud detection, and compliance with insurance policies.

Claim Information: ${message}
${fileData ? `File Data: ${fileData}` : ''}

Instructions:
1. Claim Validation:
   - Assess if the claim appears legitimate based on provided information
   - Check for red flags or inconsistencies that might indicate fraud
   - Validate completeness of claim documentation

2. Fraud Detection Analysis:
   - Identify potential fraud indicators
   - Assess claim amount reasonableness
   - Check for suspicious patterns or timing

3. Policy Compliance:
   - Verify if claim falls within policy coverage
   - Check for policy exclusions
   - Assess deductible applicability

4. Documentation Requirements:
   - List required documents for this type of claim
   - Identify missing documentation
   - Suggest additional evidence needed

5. Risk Assessment:
   - Provide overall risk score (Low, Medium, High)
   - Highlight areas needing further investigation
   - Recommend next steps

Provide a clear, helpful response about the insurance claim. If the query is not related to insurance claims, provide helpful guidance about insurance claim processes instead.

Format your response in a conversational, helpful manner while being thorough and professional.`;

    // Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const geminiResult = await response.json();

    // Extract the response text
    const candidates = geminiResult?.candidates;
    const responseText = candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not process your request at this time.';

    return NextResponse.json({
      success: true,
      response: responseText,
      rawResponse: geminiResult
    });

  } catch (error) {
    console.error("Error in claim analysis:", error);
    return NextResponse.json({ 
      error: "Failed to analyze insurance claim",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load local environment variables if available
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI on the server
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for Loan Eligibility Advisor
app.post("/api/loan-advice", async (req, res) => {
  try {
    const { input, metrics } = req.body;

    if (!input || !metrics) {
      return res.status(400).json({ error: "Missing input or metrics content for AI advisory" });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful fallback for missing AI key
      return res.json({
        summary: "Notice: Gemini API key is missing from environment. Showing deterministic simulation insights.",
        reasons: [
          `Credit rating evaluated as ${metrics.creditRating} based on score of ${input.creditScore}.`,
          `Current Debt-To-Income (DTI) ratio is estimated at ${metrics.dtiRatio}%, incorporating proposed EMI.`
        ],
        recommendations: [
          "Enable your Gemini API key in the Secrets Panel of Google AI Studio for deeper automated consulting.",
          "Keep your total monthly debt payments under 35-40% of your gross monthly earnings."
        ],
        improvements: [
          "Pay off minor existing consumer lines of credit to lower your current DTI ratio.",
          "Verify and challenge credit report errors periodically to naturally elevate score points."
        ],
        alternatives: [
          `Consider applying for a lower loan principal (e.g., $${Math.round(input.loanAmount * 0.75)}) to lower monthly DTI risk.`,
          "Explore a co-signer or pledged collateral options with preferred direct retail lenders."
        ]
      });
    }

    // Construct detailed structured prompt
    const prompt = `
      You are LoanWise AI, a senior retail credit underwriting officer and financial adviser. 
      Review current loan applicant status and calculate a detailed evaluation report.
      
      APPLICANT INPUTS:
      - Monthly Income: $${input.monthlyIncome}
      - Existing EMI: $${input.existingEmi}
      - Monthly Expenses: $${input.monthlyExpenses}
      - Savings (Total liquid cash or monthly savings flow): $${input.savings}
      - Credit Score: ${input.creditScore} (${metrics.creditRating} rating)
      - Employment Type: ${input.employmentType} with ${input.experience} years of experience.
      - Age: ${input.age} years old
      - City/Location: ${input.city}
      - Loan Requested: $${input.loanAmount} for a tenure of ${input.loanTenure} years.
      - Proposed Loan Type: ${input.loanType}
      
      DETERMINISTIC METRICS EVALUATION:
      - Proposed monthly EMI: $${metrics.proposedEmi} (Estimated at ${metrics.interestRate}% interest rate)
      - Total Debt-To-Income (DTI) Ratio including proposed EMI: ${metrics.dtiRatio}%
      - Proposed EMI to Income Ratio: ${metrics.emiToIncomeRatio}%
      - Savings Ratio: ${metrics.savingsRatio}%
      - Remaining Monthly Disposable Income: $${metrics.disposableIncome}
      - Limit of maximum affordable loan principal: $${metrics.maxAffordableLoan}
      - Algorithmic Approval Probability: ${metrics.approvalProbability}%
      - Algorithmic Risk Rating: ${metrics.riskLevel}

      Please analyze this loan assessment profile and generate a comprehensive response formatted to the JSON schema.
      Keep the reasons, recommendations, improvements, and alternatives incredibly quantitative, realistic, and highly professional. Incorporate actual fintech knowledge.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional, direct, trustworthy fintech senior underwriter advisor. You speak quantitatively, with concise, helpful, and sophisticated financial metrics. You do not use generic filler statements.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A high-level introductory summary statement outlining the core eligibility outcome."
            },
            reasons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 to 4 detailed quantitative reasons behind this decision (e.g. mentioning DTI, credit tier, or employment tenure)."
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 to 4 strategic financial advisory recommendations for the user's specific loan application context."
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 to 3 actionable, high-impact exercises the user can perform in 30-90 days to boost their approval odds."
            },
            alternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 specific alternative financing tactics (e.g. restructuring tenure, lowering principal or alternative credit products)."
            }
          },
          required: ["summary", "reasons", "recommendations", "improvements", "alternatives"]
        }
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Advisor Endpoint Error:", error);
    res.status(500).json({ error: "Failed to generate AI underwriting audit: " + error.message });
  }
});

// Configure Vite middleware in development or serve static assets in production
const runServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LoanWise AI full-stack server running at http://localhost:${PORT}`);
  });
};

runServer().catch((err) => {
  console.error("Failed to bootstrap server container:", err);
});

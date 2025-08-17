import { NextRequest, NextResponse } from "next/server";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { ethers } from "ethers";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    console.log("Received question:", question);

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    console.log("Provider:", provider);

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    console.log("Wallet:", wallet);

    const broker = await createZGComputeNetworkBroker(wallet);
    console.log("Broker:", broker);

    const deposit = Number(ethers.formatEther(ethers.parseEther("0.0000005")));
    console.log("Deposit value:", deposit);

    const services = await broker.inference.listService();
    console.log("Available services:", services);

    await broker.inference.acknowledgeProviderSigner(process.env.PROVIDER_API!);

    const { endpoint, model } = await broker.inference.getServiceMetadata(
      process.env.PROVIDER_API!
    );
    const headers = await broker.inference.getRequestHeaders(
      process.env.PROVIDER_API!,
      question
    );
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: question }],
      }),
    });

    const text = await response.text();
    console.log("Chat completion response:", JSON.parse(text));
    const account = await broker.ledger.getLedger();
    console.log(`Balance: ${ethers.formatEther(account.availableBalance)}`);
    return NextResponse.json(JSON.parse(text), { status: 200 });
  } catch (error) {
    console.error("Error initializing broker:", error);
    return NextResponse.json(
      { error: "Failed to initialize broker" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!, {
    chainId: 16601,
    name: "0g-testnet",
  });
  console.log("RPC URL: ", process.env.RPC_URL);
  console.log("Provider: ", provider);
  try {
    const network = await provider.getNetwork();
    console.log("Connected network:", network);

    const block = await provider.getBlockNumber();
    console.log("Latest block:", block);
    return NextResponse.json({ network, block }, { status: 200 });
  } catch (err) {
    console.error("Provider error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch network or block information",
      },
      { status: 500 }
    );
  }
}

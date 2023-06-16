import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userMessageCount, setUserMessageCount] = useState<number>(0); // Añadir un contador de mensajes del usuario

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const customPrompt = `   
  Responde de manera fiel, profesional e interesante a la pregunta del ususario siempre teniendo en cuenta la pregunta y si tiene relación o no con Alejandra para decidir si responder o no Basandote en la información que tienes sobre Alejandra García Mundi. Analiza también la pregunta para ver como responder de la mejora manera en base a lo indicado.
  `;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    if (userMessageCount >= 5) { // Verificar si se ha alcanzado el límite
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: `Se ha alcanzado el límite de mensajes. Si tienes más dudas, siempre puedes contactar con _____________ a través de:
    Correo:  XXXXXXXX
    Teléfono:  XXXXXXXXXX
    LinkedIn:  XXXXXXXXXXXXXXXX
          `,
        },
      ]);
      return;
    }

    const updatedMessages = [...messages, message];

    const updatedMessagesWithCustomPrompt = updatedMessages.map((msg, index) => {
      if (index === updatedMessages.length - 1 && msg.role === "user") {
        return { ...msg, content: `${msg.content} ${customPrompt}` };
      }
      return msg;
    });

    setMessages(updatedMessages);
    setLoading(true);

    if (message.role === "user") { // Aumentar el contador si es un mensaje de usuario
      setUserMessageCount(userMessageCount + 1);
    }
  
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessagesWithCustomPrompt,
      }),
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: chunkValue
          }
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + chunkValue
          };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hola, soy el CV virtual de Alejandra García Mundi ¿En que te puedo ayudar?`
      }
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hola, soy el CV virtual de Alejandra García Mundi ¿En que te puedo ayudar?`
      }
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Chatbot UI</title>
        <meta
          name="description"
          content="A simple chatbot starter kit for OpenAI's chat model using Next.js, TypeScript, and Tailwind CSS."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

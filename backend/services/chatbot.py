from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableLambda
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser
from langchain_community.chat_message_histories import ChatMessageHistory
from dotenv import load_dotenv

load_dotenv()

store = {}
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

def build_chain():
    vectordb = PineconeVectorStore(
        index_name="study-chatbot",
        embedding=embeddings
    )
    retriever = vectordb.as_retriever(search_kwargs={"k": 3})

    llm = ChatGroq(model="openai/gpt-oss-120b", temperature=0.3, max_tokens=1500)

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a helpful personal study assistant.
        Answer only from the context below.
        If not found, say 'I could not find this in your study materials.'

        Context: {context}"""),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}")
    ])

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    chain = (
        {
            "context": RunnableLambda(lambda x: x["question"]) | retriever | format_docs,
            "question": RunnableLambda(lambda x: x["question"]),
            "chat_history": RunnableLambda(lambda x: x.get("chat_history", []))
        }
        | prompt | llm | StrOutputParser()
    )

    return RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="question",
        history_messages_key="chat_history"
    ), retriever

# Build once on startup
rag_chain, retriever = build_chain()

def get_answer(question: str, session_id: str):
    docs = retriever.invoke(question)
    sources = list(set([doc.metadata.get("source", "Unknown") for doc in docs]))
    answer = rag_chain.invoke(
        {"question": question},
        config={"configurable": {"session_id": session_id}}
    )
    return answer, sources
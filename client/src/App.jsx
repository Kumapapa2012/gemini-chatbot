import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState('');
  const [answer, setAnswer] = useState('');
  const [showThinking, setShowThinking] = useState(false);

  const handleSubmit = async () => {
    setThinking('');
    setAnswer('');
    //
    console.log('input:', input);
    
    // URLSearchParamsなどでクエリパラメータを作成
    const response = await fetch(`/api/chat?prompt=${encodeURIComponent(input)}`);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      let currentEvent = '';
      lines.forEach(line => {
        if (line.startsWith('event:')) {
          currentEvent = line.replace('event: ', '').trim();
        } else if (line.startsWith('data:')) {
          const data = JSON.parse(line.replace('data: ', ''));
          if (currentEvent === 'thinking') {
            setThinking(prev => prev + data.content);
          } else if (currentEvent === 'answer') {
            setAnswer(prev => prev + data.content);
          }
        }
      });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gemini Chat with Thinking</h1>
      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        style={{ width: '100%', height: '100px' }}
      />
      <br />
      <button onClick={handleSubmit}>送信</button>

      <hr />

      {/* 表示切り替えスイッチ */}
      <label>
        <input 
          type="checkbox" 
          checked={showThinking} 
          onChange={() => setShowThinking(!showThinking)} 
        />
        思考過程を表示する
      </label>

      {showThinking && (
        <div
          style={{
            padding: '10px',
            marginTop: '10px',
            borderRadius: '5px',
            height: '150px',
            overflowY: 'auto'
          }}
        >
          <strong>思考中...</strong>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{thinking}</pre>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '1.2rem' }}>
        <strong>回答:</strong>
        <div style={{ border: '1px solid ', padding: '10px', borderRadius: '4px' }}>
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default App;
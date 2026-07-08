import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Play } from 'lucide-react';

export default function TerminalConsole({ t, theme, toggleTheme }) {
  const [history, setHistory] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isMatrix, setIsMatrix] = useState(false);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize terminal history on mount
  useEffect(() => {
    setHistory([
      { text: t('terminal_welcome_1'), type: 'system' },
      { text: t('terminal_welcome_2'), type: 'system' },
      { text: '', type: 'spacer' }
    ]);
  }, [t]);

  // Scroll to bottom on history change
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  // Focus input on terminal click
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Matrix Rain Animation
  useEffect(() => {
    if (!isMatrix) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabet = katakana.split('');

    const fontSize = 14;
    const columns = width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    // Resize handler
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    draw();

    // Disable matrix on keypress
    const exitMatrix = () => {
      setIsMatrix(false);
      setHistory(prev => [
        ...prev,
        { text: t('terminal_matrix_exit'), type: 'system' }
      ]);
    };
    window.addEventListener('keydown', exitMatrix);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', exitMatrix);
    };
  }, [isMatrix, t]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory = [...history, { text: `guest@sirac.dev:~$ ${cmd}`, type: 'input' }];

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    if (trimmed === 'matrix') {
      setIsMatrix(true);
      setHistory([
        { text: t('terminal_matrix_start'), type: 'system' }
      ]);
      return;
    }

    let reply = '';
    let replyType = 'output';

    switch (trimmed) {
      case 'help':
        reply = t('terminal_cmd_help');
        break;
      case 'about':
        reply = t('terminal_cmd_about');
        break;
      case 'projects':
        reply = t('terminal_cmd_projects');
        break;
      case 'contact':
        reply = t('terminal_cmd_contact');
        break;
      case 'theme':
        toggleTheme();
        reply = t('terminal_cmd_theme');
        break;
      case '':
        reply = '';
        break;
      default:
        reply = `${t('terminal_cmd_not_found')} "${cmd}". ${t('terminal_cmd_not_found_help')}`;
        replyType = 'error';
    }

    setHistory([...newHistory, { text: reply, type: replyType }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCommand(inputVal);
    setInputVal('');
  };

  return (
    <section id="terminal" style={{ paddingTop: '6rem' }}>
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">{t('terminal_title')}</h2>
        <p className="section-subtitle">{t('terminal_subtitle')}</p>
      </div>

      <div 
        className="terminal-window glass-panel" 
        onClick={focusInput}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Terminal Header Bar */}
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <div className="terminal-title-text">
            <Terminal size={14} style={{ marginRight: '6px' }} />
            sh - bash - 80x24
          </div>
          <div style={{ width: '45px' }}></div>
        </div>

        {/* Console Body */}
        <div className="terminal-body">
          {isMatrix ? (
            <div className="matrix-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
              <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
              <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, background: 'rgba(0,0,0,0.7)', padding: '6px 12px', borderRadius: '4px', border: '1px solid #0F0', color: '#0F0', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                {t('terminal_matrix_hint')}
              </div>
            </div>
          ) : null}

          <div className="terminal-history">
            {history.map((line, idx) => {
              if (line.type === 'spacer') {
                return <div key={idx} style={{ height: '8px' }} />;
              }
              return (
                <div 
                  key={idx} 
                  className={`terminal-line line-${line.type}`}
                  style={{ whiteSpace: 'pre-wrap', marginBottom: '4px' }}
                >
                  {line.text}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {!isMatrix && (
            <form onSubmit={handleSubmit} className="terminal-prompt">
              <span className="prompt-label">guest@sirac.dev:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="prompt-input"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <span className="blinking-cursor">_</span>
            </form>
          )}
        </div>

        {/* Scanlines visual effect overlay */}
        <div className="terminal-scanlines" />
      </div>
    </section>
  );
}

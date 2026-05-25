// AI 三维编辑器推广卡片
(function () {
    // 检查是否在当前会话已关闭
    if (sessionStorage.getItem('editorCardClosed')) {
        return;
    }

    const style = document.createElement('style');
    style.textContent = `
    .editor-card {
      position: fixed;
      top: 60px;
      right: 20px;
      background: rgba(31, 31, 46, 0.95);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 8px;
      padding: 12px 14px;
      width: 240px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
      z-index: 9999;
      animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      backdrop-filter: blur(8px);
      user-select: none;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(300px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .editor-card-title {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 10px;
    }

    .editor-card-btn {
      display: block;
      width: 100%;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      border: none;
      border-radius: 5px;
      padding: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      text-align: center;
    }

    .editor-card-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 12px rgba(99, 102, 241, 0.3);
    }

    .editor-card-close {
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
      padding: 2px;
    }

    .editor-card-close:hover {
      color: #fff;
    }

    @media (max-width: 640px) {
      .editor-card {
        width: 220px;
        top: 10px;
        right: 10px;
      }
    }
  `;
    document.head.appendChild(style);

    const card = document.createElement('div');
    card.className = 'editor-card';
    card.innerHTML = `
    <button class="editor-card-close">×</button>
    <div class="editor-card-title">国内首款 AI - 3D编辑器 已开源🔥</div>
    <a href="https://z2586300277.github.io/threejs-editor-beta/#/editor" 
       target="_blank" 
       rel="noopener noreferrer"
       class="editor-card-btn">
      立即体验 ✨
    </a>
  `;

    // 插入到页面
    const insertCard = () => {
        if (document.body) {
            document.body.appendChild(card);
            // 关闭按钮事件
            card.querySelector('.editor-card-close').addEventListener('click', () => {
                card.style.animation = 'slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) reverse';
                setTimeout(() => card.remove(), 400);
                // 存储到sessionStorage，浏览器关闭后自动清除
                sessionStorage.setItem('editorCardClosed', '1');
            });
        } else {
            setTimeout(insertCard, 100);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertCard);
    } else {
        insertCard();
    }
})();



// AI 三维编辑器推广卡片
(function () {
    // 检查是否在当前会话已关闭
    if (sessionStorage.getItem('editorCardClosed')) {
        return;
    }

    const style = document.createElement('style');
    style.textContent = `
    .edt-promo-card--v1 {
      position: fixed;
      top: 60px;
      right: 20px;
      background: rgba(31, 31, 46, 0.95);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 8px;
      padding: 12px 14px;
      width: 240px;
      box-sizing: border-box;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
      z-index: 9999;
      animation: edt-promo-slidein--v1 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      backdrop-filter: blur(8px);
      user-select: none;
    }

    @keyframes edt-promo-slidein--v1 {
      from { opacity: 0; transform: translateX(300px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .edt-promo-card__title--v1 {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 10px;
    }

    .edt-promo-card__actions--v1 {
      display: flex;
      gap: 8px;
    }

    .edt-promo-card__btn--v1 {
      display: inline-flex;
      width: calc(50% - 4px);
      box-sizing: border-box;
      background: linear-gradient(135deg, #2656f4 0%, #ce6bf3 100%);
      color: white;
      border: none;
      border-radius: 5px;
      padding: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: normal;
      margin: 0;
    }

    .edt-promo-card__btn--secondary-v1 {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.22);
    }

    .edt-promo-card__btn--v1:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 12px rgba(99, 102, 241, 0.3);
    }

    .edt-promo-card__close--v1 {
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

    .edt-promo-card__close--v1:hover {
      color: #fff;
    }

    @media (max-width: 640px) {
      .edt-promo-card--v1 {
        width: 220px;
        top: 10px;
        right: 10px;
      }
    }
  `;
    document.head.appendChild(style);

    const card = document.createElement('div');
    card.className = 'edt-promo-card--v1';
    card.innerHTML = `
    <button class="edt-promo-card__close--v1">×</button>
    <div class="edt-promo-card__title--v1">国内首款 AI - 3D编辑器 已开源🔥</div>
    <div class="edt-promo-card__actions--v1">
      <a href="https://z2586300277.github.io/threejs-editor-beta/#/editor" 
         target="_blank" 
         rel="noopener noreferrer"
         class="edt-promo-card__btn--v1">
        立即使用
      </a>
      <a href="https://z2586300277.github.io/yyhg/" 
         target="_blank" 
         rel="noopener noreferrer"
         class="edt-promo-card__btn--v1 edt-promo-card__btn--secondary-v1">
        示例项目
      </a>
    </div>
  `;

    // 插入到页面
    const insertCard = () => {
        if (document.body) {
            document.body.appendChild(card);
            // 关闭按钮事件
            card.querySelector('.edt-promo-card__close--v1').addEventListener('click', () => {
                card.style.animation = 'edt-promo-slidein--v1 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) reverse';
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



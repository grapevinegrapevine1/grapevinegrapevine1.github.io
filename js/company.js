$(document).ready(function() {
    // 背景テキストのアニメーション
    addScrollAnimation($('.background-text'), "slide-in-from-right", true);
    addScrollAnimation($('.profile-background-text'), "slide-in-from-right", true);
    
    addScrollAnimation($('.ceo-content'), "fade-in", false);
    addScrollAnimation($('.ceo-message div'), "active", true);
    
    addScrollAnimation($('.profile-content'), "fade-in", false);
    
    
    // 各セクションの要素にスクロールアニメーションを追加
    addScrollAnimation($('.message-container'), "wipe-from-left", false);
    
    addScrollAnimation($('.profile-content'), "fade-in", false);
    addScrollAnimation($('.profile-table'), "highlight-tr", true);
});

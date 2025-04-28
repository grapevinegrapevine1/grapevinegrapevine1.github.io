$(document).ready(function() {
    benefitImgAnimation();
    
    addScrollAnimation($('.background-text'), "slide-in-from-right", true);
	addScrollAnimation($('.philosophy-title'), "wipe-from-left", false);
	addScrollAnimation($('.benefit-img'), "fade-in-long", false);
    addScrollAnimation($('.benefits-card-list'), "highlight-li", true);
	addScrollAnimation($('.benefits-card-list'), "fade-in-long", false);
	
	accordionBenefit();
});

// 制度のアコーディオン機能
function accordionBenefit(){
    // アコーディオン機能 - 専用ボタンをクリックした場合
    $('.accordion-toggle').click(function(e) {
        e.stopPropagation(); // 親要素へのイベント伝播を防止
        const $item = $(this).closest('.benefit-card-item');
        
        // 現在のアコーディオンをトグル
        $item.toggleClass('accordion-active');
        
        // アニメーション状態をリセット（クリック後の不自然なアニメーション防止）
        $(this).css('animation', 'none');
        setTimeout(() => {
            $(this).css('animation', '');
        }, 10);
    });
    
	// 制度カード自体をクリックした場合もアコーディオンを開閉
	$('.benefit-card-item').click(function(e) {
	    // アコーディオントグルボタン自体がクリックされた場合は何もしない（上のハンドラで処理される）
	    if ($(e.target).hasClass('accordion-toggle') || $(e.target).closest('.accordion-toggle').length) {
	        return;
	    }
	    
	    // アコーディオンコンテンツ内のリンク要素がクリックされた場合は閉じない
	    if ($(e.target).closest('.accordion-content').length && $(e.target).is('a.detail-link')) {
	        return;
	    }
	    
	    // 全てのアコーディオンの状態を現在クリックしたアイテムと同じにする
	    const isActive = $(this).hasClass('accordion-active');
	    
	    if (isActive) {
	        // 全て閉じる
	        $('.benefit-card-item').removeClass('accordion-active');
	    } else {
	        // 全て開く
	        $('.benefit-card-item').addClass('accordion-active');
	    }
	    
	    // 全てのトグルボタンのアニメーション状態をリセット
	    $('.benefit-card-item').find('.accordion-toggle').css('animation', 'none');
	    setTimeout(() => {
	        $('.benefit-card-item').find('.accordion-toggle').css('animation', '');
	    }, 10);
	});
    
    // ホバー効果の拡張（オプション）
    $('.benefit-card-item').hover(
        function() {
            // ホバー開始時、アコーディオンが閉じている場合のみアニメーション適用
            if (!$(this).hasClass('accordion-active')) {
                $(this).find('.accordion-toggle').addClass('hover-active');
            }
        },
        function() {
            // ホバー終了時
            $(this).find('.accordion-toggle').removeClass('hover-active');
        }
    );
}

function benefitImgAnimation(){
	// 初期位置
    const initialPosition = -500;
    // 移動量を調整（大きい値ほど移動が穏やかになる）
    const scrollFactor = 50;
    
    $(window).scroll(function() {
        // スクロール量を取得
        const scrollTop = $(window).scrollTop();
        
        // benefitセクションの位置を取得
        const benefitOffset = $('.benefit-img').offset().top;
        
        // 画面上部からbenefitセクションまでの距離
        const distance = benefitOffset - scrollTop;
        
        // スクロールに基づいて背景位置を計算
        // 表示領域に入るとアニメーションが始まるように調整
        if (distance < $(window).height()) {
            // スクロール量に基づいて横位置を変更（左から右へ）
            const newPosition = initialPosition + (($(window).height() - distance) / scrollFactor);
            
            // 背景位置を更新（x座標のみ変更）
            $('.benefit-img').css('background-position-x', newPosition + 'px');
        }
    });
    
    // 初期表示時にも一度実行して位置を設定
    $(window).trigger('scroll');
}
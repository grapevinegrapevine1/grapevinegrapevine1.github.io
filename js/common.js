$(document).ready(function() {
    // ヘッダーのアニメーション
	headerBounceAnimation();
	
    addScrollAnimation($('.footer'), "poyon-from-bottom", true);
});

// スクロールアニメーション機能の追加
function addScrollAnimation(elem, animationClassName, notHide) {
    elem = $(elem);
    
    // スクロールイベントハンドラを変数に格納
    const scrollHandler = function() {
        // スクロール量を取得
        const scrollTop = $(window).scrollTop();
        
        // 要素の位置を取得
        const elemOffset = elem.offset().top;
        const elemHeight = elem.outerHeight();
        
        // 画面上部から要素までの距離
        const distance = elemOffset - scrollTop;
        
        // 要素が表示領域に入ったらクラスを追加
        if (distance < $(window).height() * 0.8 && distance + elemHeight > 0) {
            elem.addClass(animationClassName);
            if(!notHide){
	            setTimeout(function(){
		            $(window).off('scroll', scrollHandler);
		            elem.removeClass(animationClassName);
		            elem.addClass("opacityOn");
		        },1000);
            }
        } else {
            // 要素が表示領域から出たらクラスを削除
            if(notHide) elem.removeClass(animationClassName);
        }
    };
    
    // イベントリスナーを追加
    $(window).on('scroll', scrollHandler);
    
    // 初期表示時に一度実行
    $(window).trigger('scroll');
}

// ヘッダーアニメーション
function headerBounceAnimation() {
    var $navItems = $('.nav-item');
    var lastScrollPosition = 0;
    var scrollingDown = true;
    var animationTimeout;
    var initialAnimation = true;
    var isAnimating = false; // アニメーション中かどうかを追跡するフラグ
    
    // 初期表示でアイテムを見えるようにする
    setTimeout(function() {
        $navItems.each(function(index) {
            var $item = $(this);
            setTimeout(function() {
                $item.addClass('visible');
                // 初期アニメーション
                setTimeout(function() {
                    applyBounceAnimation();
                }, 500);
            }, index * 100);
        });
        initialAnimation = false;
    }, 100);
    
    // スクロールイベントのリスナー
    $(window).on('scroll', function() {
        // アニメーション実行中は何もしない
        if (isAnimating) {
            return;
        }
        
        var currentScrollPosition = $(window).scrollTop();
        
        // スクロール方向を検出
        scrollingDown = currentScrollPosition > lastScrollPosition;
        lastScrollPosition = currentScrollPosition;
        
        // スクロール中はタイムアウトをクリア
        clearTimeout(animationTimeout);
        
        // スクロールが停止したときに実行
        animationTimeout = setTimeout(function() {
            // アニメーション中は実行しない
            if (!isAnimating) {
                // スクロール停止時、順番にバウンスアニメーション
                applyBounceAnimation();
            }
        }, 1); // スクロールが停止してから実行するまでの遅延
    });
    
	// バウンスアニメーションを適用する関数
	function applyBounceAnimation() {
	    // 既にアニメーション中なら何もしない
	    if (isAnimating) {
	        return;
	    }
	    
	    // アニメーション開始
	    isAnimating = true;
	    
	    // アニメーション終了時間を計算（最後のアイテムのアニメーション終了時間）
	    var animationEndTime = ($navItems.length - 1) * 150 + 700;
	    
	    // すべてのバウンスクラスをリセット
	    $navItems.removeClass('bounce');
	    
	    $navItems.each(function(index) {
	        var $item = $(this);
	        // 各アイテムにタイムアウトを設定して順番にアニメーション
	        setTimeout(function() {
	            $item.addClass('bounce');
	            // アニメーション終了後にクラスを削除
	            setTimeout(function() {
	                $item.removeClass('bounce');
	            }, 500); // アニメーション時間と同じ
	        }, index * 100);
	    });
	    
	    // アニメーション完了後にフラグをリセット
	    setTimeout(function() {
	        isAnimating = false;
	    }, animationEndTime);
	}
}


// お問い合わせフォームの送信処理
function postContactForm(){
	document.getElementById("contact-form").addEventListener("submit", function(e) {
	    e.preventDefault(); // 画面遷移を防ぐ
	    var formData = new FormData(this);
	    let button = $("#contact-button").prop("disabled", true)
	    let buttonTxt = $(".contact-button-text");
	    buttonTxt.text("送信中");
	    
	    fetch("https://script.google.com/macros/s/AKfycbysi0nA4fd2cNduTynbRgBP_iS6e4UTmjVsOTQZiRFCDTRUNJug6KTLh2nviJWY81LYAw/exec", {
	        method: "POST",
	        headers: {
	            "Content-Type": "application/x-www-form-urlencoded"
	        },
	        body: new URLSearchParams({
	            "inquiry-type": $("#inquiry-type").val(),
	            "name": $("#name").val(),
	            "_replyto": $("#email").val(),
	            "company": $("#company").val(),
	            "message": $("#message").val()
	        })
	    })
	    .then(response => response.text()) // テキスト形式としてパース
	    .then(data => {
	        console.log(data); // "お問い合わせを受け付けました。" と表示される
	        showMessage('お問い合わせが正常に送信されました。お問い合わせいただきありがとうございます。', 'success');
	        // フォームをリセット
	        this.reset();
	        button.prop("disabled", false);
	        buttonTxt.text("送信する");
	    })
	    .catch((error) => {
	        console.error('Error:', error);
	        // エラーメッセージを表示
	        showMessage('送信中にエラーが発生しました', 'error');
	        button.prop("disabled", false);
	        buttonTxt.text("送信する");
	    });
	});
}
function showMessage(message, type) {
    let messageDiv = $("#alert_message").fadeIn();
    let messageTxt = $("#alert_message div").text(message).addClass(type);
    
    // 5秒後にメッセージを消す
    setTimeout(function() {
        messageDiv.fadeOut();
        messageTxt.text("").removeClass(type);
    }, 5000);
}
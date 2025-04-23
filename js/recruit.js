$(document).ready(function() {
    // スクロールアニメーション
    addScrollAnimation($('.title'), "fade-in", false);
    
    addScrollAnimation($('.message-container'), "wipe-from-left", false);
    addScrollAnimation($('.philosophy-content'), "fade-in", false);
    
    
    addScrollAnimation($('.background-text'), "slide-in-from-right", true);
    addScrollAnimation($('.background-text-support'), "slide-in-from-right", true);
    
    addScrollAnimation($('.compensation-main-panel'), "wipe-from-left", false);
    addScrollAnimation($('.compensation-panel:nth-child(1)'), "active", false);
    addScrollAnimation($('.compensation-panel:nth-child(2)'), "active", false);
    addScrollAnimation($('.compensation-panel:nth-child(3)'), "active", false);
    addScrollAnimation($('.compensation-panel:nth-child(4)'), "active", false);
    
    addScrollAnimation($('.support-section'), "fade-in", false);
    
    addScrollAnimation($('.benefit-section'), "fade-in", false);
	addScrollAnimation($('.benefit-img'), "fade-in-long", false);
    addScrollAnimation($('.benefit-items'), "highlight-div", true);
    
    addScrollAnimation($('.company-stats-section'), "fade-in", false);
    
    addScrollAnimation($('.ceo-content'), "fade-in", false);
    addScrollAnimation($('.ceo-message div'), "active", true);
    
    addScrollAnimation($('.entry-section'), "fade-in", false);
    
    benefitImgAnimation();
    
	// エントリーフォームサブミット処理
	postRecruitEntryForm();
	
	// チャート作成
	createChart();
	
	
	// ドキュメント準備完了時に初期化
	initCompanyPamphletSlider();
});

// 会社案内スライダー初期化
function initCompanyPamphletSlider() {
    const pamphletSwiper = new Swiper('.company-pamphlet-swiper', {
        // スライダーのオプション
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        effect: 'creative',
        creativeEffect: {
            prev: {
                shadow: true,
                translate: ['-20%', 0, -1],
            },
            next: {
                translate: ['100%', 0, 0],
            },
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        /*autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },*/
    });
}

// サポートセクションフローの表示アニメーション
$(document).ready(function() {
	supportAnimation();
	$(window).scroll(supportAnimation);
	function supportAnimation() {
	    const supportSection = $('.support-section');
	    const supportOffset = supportSection.offset()?.top || 0;
	    const windowHeight = $(window).height();
	    const scrollPos = $(window).scrollTop();
	    
	    // スマホ表示かどうかを判定（画面幅でチェック）
	    const isMobile = window.innerWidth <= 767; // 一般的なスマホ用ブレークポイント
	    // スマホの場合は+150msのディレイを追加
	    const delayOffset = isMobile ? 200 : 0;
	    
	    // Animate Support section when scrolled to
	    if (scrollPos > supportOffset - windowHeight * 0.8) {
	        if (!supportSection.hasClass('active')) {
	            supportSection.addClass('active');
	            
	            // Animate panels with delay - スマホの場合は遅延を+100ms
	            setTimeout(function() {
	                $('#support-panel-1').addClass('active');
	            }, 100 + delayOffset);
	            
	            setTimeout(function() {
	                $('.line-1').addClass('active');
	            }, 200 + delayOffset);
	            
	            setTimeout(function() {
	                $('#support-panel-2').addClass('active');
	            }, 300 + delayOffset);
	            
	            setTimeout(function() {
	                $('.line-2').addClass('active');
	            }, 400 + delayOffset);
	            
	            setTimeout(function() {
	                $('#support-panel-3').addClass('active');
	            }, 500 + delayOffset);
	        }
	    }
	}
});


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

// エントリーフォームサブミット処理
function postRecruitEntryForm() {
    document.getElementById("recruit-entry-form").addEventListener("submit", function(e) {
        e.preventDefault(); // Prevent page transition
        var formData = new FormData(this);
        let button = document.querySelector("#post-entry-button");
        let buttonText = button.querySelector("span");
        
        // Disable button and change text during submission
        button.disabled = true;
        buttonText.textContent = "送信中";
        
        fetch("https://script.google.com/macros/s/AKfycbxKDMu2ewauLT9fz6bC3KsqD8RXecyKRK3GEYMJ8f9XMSliyJTW2o_rqcKz3f12vBPN1A/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                "name": document.getElementById("entry-name").value,
                "email": document.getElementById("entry-email").value,
                "entry-type": document.getElementById("entry-type").value,
                "message": document.getElementById("entry-message").value || "メッセージなし"
            })
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            showMessage('エントリーを受け付けました。ありがとうございます。', 'success');
            
            // Reset form
            this.reset();
            
            // Re-enable button
            button.disabled = false;
            buttonText.textContent = "エントリーする";
        })
        .catch((error) => {
            console.error('Error:', error);
            showMessage('エントリー送信中にエラーが発生しました', 'error');
            
            // Re-enable button
            button.disabled = false;
            buttonText.textContent = "エントリーする";
        });
    });
}

function createChart(){
	// Create the Intersection Observer
    const chartObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // チャートが表示範囲に入ったらアニメーションを実行
                const chartId = entry.target.id;
                const chart = Chart.getChart(chartId);
                
                if (chart) {
                    // チャートの種類に応じてアニメーションを設定
                    if (chart.config.type === 'bar') {
                        // 棒グラフの場合
                        chart.data.datasets.forEach((dataset) => {
                            const originalData = [...dataset.data];
                            dataset.data = dataset.data.map(() => 0);
                            chart.update('none');
                            
                            // データを徐々に表示
                            originalData.forEach((value, index) => {
                                setTimeout(() => {
                                    dataset.data[index] = value;
                                    chart.update();
                                }, 300 * index);
                            });
                        });
                    } else if (chart.config.type === 'doughnut' || chart.config.type === 'pie') {
                        // ドーナツチャートとパイチャートの場合
                        const originalData = [...chart.data.datasets[0].data];
                        chart.data.datasets[0].data = originalData.map(() => 0);
                        chart.update('none');
                        
                        // データを徐々に表示
                        originalData.forEach((value, index) => {
                            setTimeout(() => {
                                chart.data.datasets[0].data[index] = value;
                                chart.update();
                            }, 200 * index);
                        });
                    }
                }
                
                // 一度アニメーションを実行したら監視を解除
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // 要素が50%表示されたらアニメーション開始
    
    // チャートのキャンバス要素を監視
    document.querySelectorAll('canvas[id]').forEach(chart => {
        chartObserver.observe(chart);
    });
    
    // チャートのデータと設定を定義
    const chartConfigs = [
        {
            id: 'overtimeChart',
            type: 'doughnut',
            labels: ['0-5時間', '5-10時間', '10-15時間', '15時間以上'],
            data: [20, 20, 0, 0],
            colors: ['#ff9900', '#ffa533', '#ffb966', '#ffcc99']
        },
        {
            id: 'remoteWorkChart',
            type: 'pie',
            labels: ['リモートワーク', '部分的リモート', '出社'],
            data: [20, 10, 10],
            colors: ['#ff9900', '#ffa533', '#ffb966']
        },
        {
            id: 'engineerExperienceChart',
            type: 'doughnut',
            labels: ['10年以上', '5-10年', '3-5年', '1-3年', '1年未満'],
            data: [20, 10, 10, 0, 0],
            colors: ['#ff9900', '#ffa533', '#ffb966', '#ffcc99', '#ffe0b2']
        },
        {
            id: 'engineerPositionChart',
            type: 'doughnut',
            labels: ['PM', 'PL', '基本設計', '詳細設計', 'コーディング'],
            data: [20, 0, 10, 10, 0],
            colors: ['#ff9900', '#ffa533', '#ffb966', '#ffcc99', '#ffe0b2']
        },
        {
            id: 'engineerSkillChart',
            type: 'doughnut',
            labels: ['フルスタック', 'クラウド', 'フロント/バック', 'バックエンド', 'テスト'],
            data: [10, 10, 20, 0, 0],	
            colors: ['#ff9900', '#ffa533', '#ffb966', '#ffcc99', '#ffe0b2']
        },
        {
            id: 'genderRatioChart',
            type: 'pie',
            labels: ['男性', '女性'],
            data: [100, 0],
            colors: ['#ff9900', '#ffa533']
        },
        {
            id: 'revenueChart',
            type: 'bar',
            labels: ['2025年', '2026年', '2027年', '2028年', '2029年'],
            data: [4, 8, 30, 50, 80],
            colors: ['#ff9900', '#ffa533', '#ffb966', '#ffcc99', '#ffe0b2']
        }
    ];
	
    // チャートの描画関数
    function createChart(config) {
        const ctx = document.getElementById(config.id).getContext('2d');
        return new Chart(ctx, {
            type: config.type,
            data: {
                labels: config.labels,
                datasets: [{
                    data: config.data,
                    backgroundColor: config.colors,
                    borderColor: config.colors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: config.type === 'doughnut' ? 'right' : 'top'
                    }
                },
                scales: config.type === 'bar' ? {
                    y: {
                        beginAtZero: true
                    }
                } : {}
            }
        });
    }

    // 各チャートを描画
    chartConfigs.forEach(createChart);
    
    // 採用者数推移チャート
    const recruitmentCtx = document.getElementById('recruitmentChart').getContext('2d');
    const recruitmentChart = new Chart(recruitmentCtx, {
        type: 'bar',
        data: {
            labels: ['2025年', '2026年', '2027年', '2028年', '2029年'],
            datasets: [{
                label: '採用者数',
                data: [4, 8, 30, 50, 80],
                backgroundColor: [
                    'rgba(255, 153, 0, 0.7)',
                    'rgba(255, 153, 0, 0.7)',
                    'rgba(255, 153, 0, 0.7)',
                    'rgba(255, 153, 0, 0.7)',
                    'rgba(255, 153, 0, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 153, 0, 1)',
                    'rgba(255, 153, 0, 1)',
                    'rgba(255, 153, 0, 1)',
                    'rgba(255, 153, 0, 1)',
                    'rgba(255, 153, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        // Y軸のラベルを整数で表示
                        precision: 0,
                        // Y軸のラベル表示を明示的に設定
                        callback: function(value) {
                            return Math.round(value);
                        }
                    }
                },
                x: {
                    ticks: {
                        // X軸のラベルを明示的に設定
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0
                    }
                }
            },
            plugins: {
                legend: {
                    // 凡例の表示設定
                    display: true
                }
            }
        }
    });
}

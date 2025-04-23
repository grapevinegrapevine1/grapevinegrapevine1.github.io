$(document).ready(function() {
    
    // 各セクションの要素にスクロールアニメーションを追加
    addScrollAnimation($('.title'), "fade-in", false);
    addScrollAnimation($('.service-overview-section'), "fade-in", false);
    
    // BPフローダイアグラム
    //addScrollAnimation($('.bp-flow-diagram'), "fade-in", false);
    //addScrollAnimation($('.flow-icon'), "active", false);
    
    
    // ケーススタディカード
    const $caseStudyCards = $('.case-study-card');
    $caseStudyCards.each(function(index) {
        const $card = $(this);
        setTimeout(function() {
            addScrollAnimation($card, "fade-in", false);
        }, index * 200);
    });
    
    // チャートが表示されたときのアニメーション
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
                    } else if (chart.config.type === 'doughnut') {
                        // ドーナツチャートの場合
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
    }, { threshold: 0.5 });
    
    // チャートのキャンバス要素を監視
    document.querySelectorAll('canvas[id]').forEach(chart => {
        chartObserver.observe(chart);
    });
    
    // お問い合わせフォームの送信処理
    postContactForm();
});


// サービス一覧セクションの表示アニメーション
$(document).ready(function() {
	seriveLineUpAnimation();
    $(window).scroll(seriveLineUpAnimation);
    function seriveLineUpAnimation() {
        const supportSection = $('.service-lineup-section');
        const supportOffset = supportSection.offset()?.top || 0;
        const windowHeight = $(window).height();
        const scrollPos = $(window).scrollTop();
        
        // Animate Support section when scrolled to
        if (scrollPos > supportOffset - windowHeight * 0.8) {
            if (!supportSection.hasClass('active')) {
                supportSection.addClass('active');
                
                // Animate panels with delay
                setTimeout(function() {
                    $('#service-card-inner-1').addClass('active');
                }, 100);
                
                setTimeout(function() {
                    $('#service-card-inner-2').addClass('active');
                }, 200);
                
                setTimeout(function() {
                    $('#service-card-inner-3').addClass('active');
                }, 300);
            }
        }
    }
});

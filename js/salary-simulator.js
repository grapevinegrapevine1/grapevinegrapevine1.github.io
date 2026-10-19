(() => {
    // DOMの読み込みが完了したら処理を開始
    document.addEventListener('DOMContentLoaded', () => {

        // --- HTML要素の生成 ---
        // シミュレーター本体のHTMLをテンプレートリテラルで定義
        const simulatorHTML = `
            <div class="simulator-modal-content">
                <span class="simulator-modal-close">&times;</span>
                <div class="simulator-body">
                    <div class="simulator-container">
                        <h1>給与シミュレーション</h1>
                        <div class="simulator-input-group">
                            <label for="unitPrice">単価（円）</label>
                            <input type="number" id="unitPrice" placeholder="単価を入力してください" min="0">
                        </div>
                        <div class="simulator-results" id="results">
                            <div class="simulator-result-item">
                                <span class="simulator-result-label">還元総額：</span>
                                <span class="simulator-result-value" id="returnTotal">¥0</span>
                            </div>
                            <div class="simulator-result-item">
                                <span class="simulator-result-label">給与(額面)：</span>
                                <span class="simulator-result-value simulator-salary" id="salary">¥0</span>
                            </div>
                            <div class="simulator-result-item">
                                <span class="simulator-result-label">会社利益：</span>
                                <span class="simulator-result-value simulator-company-profit" id="companyProfit">¥0</span>
                            </div>
                            <div class="simulator-result-item">
                                <span class="simulator-result-label">年収(給与×12ヶ月)：</span>
                                <span class="simulator-result-value simulator-annual-salary" id="annualSalary">¥0</span>
                            </div>
                        </div>
                        <div class="simulator-note">
                            ※ 会社の利益は最大10万円までとし、単価の8割を給与還元します。<br>
                            ※ 年収は月給×12ヶ月で計算しています。
                        </div>
                        <div class="simulator-comparison" id="comparison">
                            <h3>他社事例（会社の利益上限なし）</h3>
                            <div class="simulator-comparison-item">
                                <span class="simulator-comparison-label">単価の8割を給与還元：</span>
                                <div class="simulator-comparison-values">
                                    <div class="simulator-comparison-value" id="comp80">¥0</div>
                                    <div class="simulator-comparison-annual" id="comp80Annual">年収: ¥0</div>
                                </div>
                            </div>
                            <div class="simulator-comparison-item">
                                <span class="simulator-comparison-label">単価の7割を給与還元：</span>
                                <div class="simulator-comparison-values">
                                    <div class="simulator-comparison-value" id="comp70">¥0</div>
                                    <div class="simulator-comparison-annual" id="comp70Annual">年収: ¥0</div>
                                </div>
                            </div>
                            <div class="simulator-comparison-item">
                                <span class="simulator-comparison-label">単価の6割を給与還元：</span>
                                <div class="simulator-comparison-values">
                                    <div class="simulator-comparison-value" id="comp60">¥0</div>
                                    <div class="simulator-comparison-annual" id="comp60Annual">年収: ¥0</div>
                                </div>
                            </div>
                             <div class="simulator-comparison-item">
                                <span class="simulator-comparison-label">単価の5割を給与還元：</span>
                                <div class="simulator-comparison-values">
                                    <div class="simulator-comparison-value" id="comp50">¥0</div>
                                    <div class="simulator-comparison-annual" id="comp50Annual">年収: ¥0</div>
                                </div>
                            </div>
                            <p style="margin-top: 15px; font-size: 12px; color: #666;">
                                ※上記は給与(月給)と年収の金額です。
                            </p>
                        </div>
                    </div>
                </div>
            </div>`;

        // ラベル要素を作成
        const openLabel = document.createElement('div');
        openLabel.id = 'simulator-open-label';
        openLabel.textContent = '給与シミュレーション';

        // モーダル要素を作成
        const modal = document.createElement('div');
        modal.id = 'simulator-modal';
        modal.className = 'simulator-modal-overlay';
        modal.innerHTML = simulatorHTML;

        // bodyに生成した要素を追加
        document.body.appendChild(openLabel);
        document.body.appendChild(modal);

        // --- イベントリスナーと計算ロジックの設定 ---
        // モーダル制御
        const closeModal = modal.querySelector('.simulator-modal-close');
        
		openLabel.addEventListener('click', () => { 
			modal.style.display = 'flex'; 
    		setTimeout(() => document.getElementById("unitPrice").focus(), 100); // 少し遅延させてフォーカス
		});
		closeModal.addEventListener('click', () => { 
			modal.style.display = 'none'; 
		});
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });

        // 計算ロジック
        const unitPriceInput = modal.querySelector('#unitPrice');
        const resultsDiv = modal.querySelector('#results');
        const returnTotalSpan = modal.querySelector('#returnTotal');
        const salarySpan = modal.querySelector('#salary');
        const companyProfitSpan = modal.querySelector('#companyProfit');
        const annualSalarySpan = modal.querySelector('#annualSalary');
        const comparisonDiv = modal.querySelector('#comparison');
        const comp80Span = modal.querySelector('#comp80');
        const comp70Span = modal.querySelector('#comp70');
        const comp60Span = modal.querySelector('#comp60');
        const comp50Span = modal.querySelector('#comp50');
        const comp80AnnualSpan = modal.querySelector('#comp80Annual');
        const comp70AnnualSpan = modal.querySelector('#comp70Annual');
        const comp60AnnualSpan = modal.querySelector('#comp60Annual');
        const comp50AnnualSpan = modal.querySelector('#comp50Annual');

        unitPriceInput.addEventListener('input', calculateSalary);

		// 標準報酬月額テーブル（協会けんぽ 東京都 2024年度）
		// [等級, 標準報酬月額, 月額報酬下限, 月額報酬上限]
		const hokenTable = [
		    [1,  58000,      0,    63000],
		    [2,  68000,  63000,    73000],
		    [3,  78000,  73000,    83000],
		    [4,  88000,  83000,    93000],
		    [5,  98000,  93000,   101000],
		    [6, 104000, 101000,   107000],
		    [7, 110000, 107000,   114000],
		    [8, 118000, 114000,   122000],
		    [9, 126000, 122000,   130000],
		    [10, 134000, 130000,  138000],
		    [11, 142000, 138000,  146000],
		    [12, 150000, 146000,  155000],
		    [13, 160000, 155000,  165000],
		    [14, 170000, 165000,  175000],
		    [15, 180000, 175000,  185000],
		    [16, 190000, 185000,  195000],
		    [17, 200000, 195000,  210000],
		    [18, 220000, 210000,  230000],
		    [19, 240000, 230000,  250000],
		    [20, 260000, 250000,  270000],
		    [21, 280000, 270000,  290000],
		    [22, 300000, 290000,  310000],
		    [23, 320000, 310000,  330000],
		    [24, 340000, 330000,  350000],
		    [25, 360000, 350000,  370000],
		    [26, 380000, 370000,  395000],
		    [27, 410000, 395000,  425000],
		    [28, 440000, 425000,  455000],
		    [29, 470000, 455000,  485000],
		    [30, 500000, 485000,  515000],
		    [31, 530000, 515000,  545000],
		    [32, 560000, 545000,  575000],
		    [33, 590000, 575000,  605000],
		    [34, 620000, 605000,  635000],
		    [35, 650000, 635000,  665000],
		    [36, 680000, 665000,  695000],
		    [37, 710000, 695000,  730000],
		    [38, 750000, 730000,  770000],
		    [39, 790000, 770000,  810000],
		    [40, 830000, 810000,  855000],
		    [41, 880000, 855000,  905000],
		    [42, 930000, 905000,  955000],
		    [43, 980000, 955000, 1005000],
		    [44,1030000,1005000, 1055000],
		    [45,1090000,1055000, 1115000],
		    [46,1150000,1115000, 1175000],
		    [47,1210000,1175000, 99999999],
		];
		
		// 報酬月額から標準報酬月額を取得
		function getStandardRemuneration(monthlyPay) {
		    for (const [grade, standard, lower, upper] of hokenTable) {
		        if (monthlyPay >= lower && monthlyPay < upper) {
		            return standard;
		        }
		    }
		    return hokenTable[hokenTable.length - 1][1]; // 上限超えは最高等級
		}
		
		function calculateSalary() {
		    const unitPrice = parseFloat(unitPriceInput.value) || 0;
		
		    if (unitPrice > 0) {
		        // 会社利益を計算（最大10万円）
		        const companyProfit = Math.min(unitPrice * 0.2, 100000);
		
		        // 還元総額を計算（単価から会社利益を引いた額）
		        const returnTotal = unitPrice - companyProfit;
		
		        // ── 社保計算 ──────────────────────────────────────────
		        // 給与概算（非課税通勤費除いた報酬月額として還元総額を使用）
		        // ※通勤費が含まれる場合は標準報酬月額の算定対象になるため保守的に還元総額で算定
		        const reportedMonthlyPay = returnTotal;
		        const standardRemuneration = getStandardRemuneration(reportedMonthlyPay);
		
		        // 協会けんぽ 東京都 2024年度 料率（労働者負担分）
		        const kenpoRate       = 0.04995; // 健康保険料（介護保険非該当）
		        const kaigoRate       = 0.0091;  // 介護保険料（40歳以上の場合、非該当なら0）
		        const nenkinRate      = 0.0915;  // 厚生年金
		        const koyoRate        = 0.006;   // 雇用保険（一般事業）※2024年度
		
		        // 40歳未満想定（介護保険なし）→ 必要に応じてkaigoRateを加算
		        const kenpo  = Math.round(standardRemuneration * kenpoRate);
		        const kaigo  = 0; // 40歳未満の場合0、40歳以上は Math.round(standardRemuneration * kaigoRate)
		        const nenkin = Math.round(standardRemuneration * nenkinRate);
		        // 雇用保険は実際の給与総額に対してかかる
		        const koyo   = Math.round(returnTotal * koyoRate);
		
		        const syaho = kenpo + kaigo + nenkin + koyo;
		
		        // 給与額面 = 還元総額 - 会社負担社保（ここでは労働者負担社保を控除して額面を推計）
		        const salary = returnTotal - syaho;
		
		        // 年収を計算
		        const annualSalary = salary * 12;
		
		        // 結果を表示
		        returnTotalSpan.textContent = formatCurrency(returnTotal);
		        salarySpan.textContent = formatCurrency(salary);
		        companyProfitSpan.textContent = formatCurrency(companyProfit);
		        annualSalarySpan.textContent = formatCurrency(annualSalary);
		
		        // デバッグ用（任意で削除可）
		        console.log(`標準報酬月額: ${standardRemuneration.toLocaleString()}円`);
		        console.log(`健康保険: ${kenpo}, 介護: ${kaigo}, 厚生年金: ${nenkin}, 雇用: ${koyo}, 合計: ${syaho}`);
		
		        // 他社事例を計算（還元率 × 社保控除）
		        // 他社も同様に標準報酬月額ベースで計算
		        function calcCompSalary(rate) {
		            const compReturn = unitPrice * rate;
		            const compStd = getStandardRemuneration(compReturn);
		            const compSyaho = Math.round(compStd * kenpoRate) + Math.round(compStd * nenkinRate) + Math.round(compReturn * koyoRate);
		            return compReturn - compSyaho;
		        }
		
		        const comp80Salary = calcCompSalary(0.8);
		        const comp70Salary = calcCompSalary(0.7);
		        const comp60Salary = calcCompSalary(0.6);
		        const comp50Salary = calcCompSalary(0.5);
		
		        comp80Span.textContent = formatCurrency(comp80Salary);
		        comp70Span.textContent = formatCurrency(comp70Salary);
		        comp60Span.textContent = formatCurrency(comp60Salary);
		        comp50Span.textContent = formatCurrency(comp50Salary);
		
		        comp80AnnualSpan.textContent = '年収: ' + formatCurrency(comp80Salary * 12);
		        comp70AnnualSpan.textContent = '年収: ' + formatCurrency(comp70Salary * 12);
		        comp60AnnualSpan.textContent = '年収: ' + formatCurrency(comp60Salary * 12);
		        comp50AnnualSpan.textContent = '年収: ' + formatCurrency(comp50Salary * 12);
		
		        resultsDiv.style.display = 'block';
		        comparisonDiv.style.display = 'block';
		    } else {
		        resultsDiv.style.display = 'none';
		        comparisonDiv.style.display = 'none';
		    }
		}
		
		function formatCurrency(amount) {
		    return '¥' + Math.round(amount).toLocaleString('ja-JP');
		}

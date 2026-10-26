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
                            <input type="number" id="unitPrice" placeholder="単価を入力してください" min="0" max="9999999">
                        </div>
                        <details class="simulator-options">
                            <summary class="simulator-options-title">オプション（還元率UP）</summary>
                            <div class="simulator-option-item">
                                <label for="optExperience">現場経験年数<span class="simulator-option-desc">1年ごとに還元率1%UP（最大3年）</span></label>
                                <div class="simulator-input-unit">
                                    <input type="number" id="optExperience" value="0" min="0" max="3" step="1">
                                    <span class="simulator-unit">年</span>
                                </div>
                            </div>
                            <div class="simulator-option-item">
                                <label for="optIncrease">増員数<span class="simulator-option-desc">1人ごとに還元率1%UP</span></label>
                                <div class="simulator-input-unit">
                                    <input type="number" id="optIncrease" value="0" min="0" step="1">
                                    <span class="simulator-unit">人</span>
                                </div>
                            </div>
                            <div class="simulator-option-item">
                                <label for="optReferral">リファラル採用数<span class="simulator-option-desc">1人ごとに還元率1%UP</span></label>
                                <div class="simulator-input-unit">
                                    <input type="number" id="optReferral" value="0" min="0" step="1">
                                    <span class="simulator-unit">人</span>
                                </div>
                                <div class="simulator-referral-allowance" id="referralAllowance"></div>
                            </div>
                            <div class="simulator-option-check">
                                <label><input type="checkbox" id="optOver40">40歳以上</label>
                            </div>
                        </details>
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
                                <div class="simulator-result-values">
                                    <span class="simulator-result-value simulator-annual-salary" id="annualSalary">¥0</span>
                                    <div class="simulator-annual-allowance" id="annualAllowance"></div>
                                </div>
                            </div>
                        </div>
                        <div class="simulator-note">
                            ※ 会社の利益は最大10万円までとし、単価の8割を給与還元します。<br>
                            ※ オプションの還元率UPは、1%につき単価の1%分を会社利益から給与へ上乗せします。<br>
                            ※ 年収は月給×12ヶ月で計算しています。リファラル手当（1人あたり20万円）は「+手当」として別途表示しています。<br>
                            ※ 見込みデータのため実際の給与と異なる場合がございます。<br>
                            ※ 給与には退職金分が含まれております。
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
        const experienceInput = modal.querySelector('#optExperience');
        const increaseInput = modal.querySelector('#optIncrease');
        const referralInput = modal.querySelector('#optReferral');
        const over40Input = modal.querySelector('#optOver40');
        const referralAllowanceDiv = modal.querySelector('#referralAllowance');
        const annualAllowanceDiv = modal.querySelector('#annualAllowance');

        const REFERRAL_ALLOWANCE = 200000; // リファラル手当（1人あたり）
        const MAX_EXPERIENCE_YEARS = 3;    // 経験年数による還元率UPの上限
        const UNIT_PRICE_MAX_DIGITS = 7;   // 単価の最大桁数（百万の位まで）

		unitPriceInput.addEventListener('input', () => {
            // 単価は百万の位（7桁）までに制限
            if (unitPriceInput.value.replace(/\D/g, '').length > UNIT_PRICE_MAX_DIGITS) {
                unitPriceInput.value = unitPriceInput.value.replace(/\D/g, '').slice(0, UNIT_PRICE_MAX_DIGITS);
            }
            calculateSalary();
        });
        experienceInput.addEventListener('input', calculateSalary);
        increaseInput.addEventListener('input', calculateSalary);
        referralInput.addEventListener('input', calculateSalary);
        over40Input.addEventListener('change', calculateSalary);

        // 入力値を0以上の整数に丸める（maxを指定した場合は上限も適用）
        function getCount(input, max = Infinity) {
            const value = Math.floor(parseFloat(input.value) || 0);
            return Math.min(Math.max(value, 0), max);
        }

        // 標準報酬月額テーブル（協会けんぽ 東京都 2024年度）
        // [等級, 標準報酬月額, 下限, 上限]
        const hokenTable = [
            [1,   58000,      0,   63000],
            [2,   68000,  63000,   73000],
            [3,   78000,  73000,   83000],
            [4,   88000,  83000,   93000],
            [5,   98000,  93000,  101000],
            [6,  104000, 101000,  107000],
            [7,  110000, 107000,  114000],
            [8,  118000, 114000,  122000],
            [9,  126000, 122000,  130000],
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

        function getStandardRemuneration(monthlyPay) {
            for (const [, standard, lower, upper] of hokenTable) {
                if (monthlyPay >= lower && monthlyPay < upper) return standard;
            }
            return hokenTable[hokenTable.length - 1][1];
        }

        function calcSyaho(standardRemuneration, actualSalary, isOver40) {
            const kaigoRate = isOver40 ? 0.0081 : 0; // 介護保険は40歳以上のみ

            // 労働者負担
            const kenpo  = Math.round(standardRemuneration * 0.04925);
            const kaigo  = Math.round(standardRemuneration * kaigoRate);
            const nenkin = Math.round(standardRemuneration * 0.0915);
            const koyo   = Math.round(actualSalary * 0.005);
            const kodomo   = Math.round(standardRemuneration * 0.00475);
            const workerTotal = kenpo + kaigo + nenkin + koyo + kodomo;

            // 会社負担（健康・介護・厚生年金は同率、雇用保険のみ異なる）
            const companyKenpo  = Math.round(standardRemuneration * 0.04925);
            const companyKaigo  = Math.round(standardRemuneration * kaigoRate);
            const companyNenkin = Math.round(standardRemuneration * 0.0915);
            const companyKoyo   = Math.round(actualSalary * 0.0085); // 会社負担多め
            const companyKodomo   = Math.round(standardRemuneration * 0.00115);
            const companyTotal  = companyKenpo + companyKaigo + companyNenkin + companyKoyo + companyKodomo;

            return { workerTotal, companyTotal };
        }

        // 還元総額から額面給与を求める（額面 = 還元総額 - 会社負担社保）
        // 標準報酬月額は額面給与で決まるため、上位等級から順に整合する等級を探す
        // 等級境界付近で整合しない場合は、額面を下位等級の上限未満に抑える
        function solveSalary(returnTotal, isOver40) {
            for (let i = hokenTable.length - 1; i >= 0; i--) {
                const [, std, lower, upper] = hokenTable[i];
                // 雇用保険は額面に依存するため反復で収束させる
                let salary = returnTotal;
                for (let j = 0; j < 10; j++) {
                    salary = returnTotal - calcSyaho(std, salary, isOver40).companyTotal;
                }
                if (salary >= lower || i === 0) {
                    return { salary: Math.min(salary, upper - 1), std };
                }
            }
        }

        function calculateSalary() {
            const unitPrice = parseFloat(unitPriceInput.value) || 0;
            const isOver40 = over40Input.checked;

            // オプション（各1%UP）
            const experienceYears = getCount(experienceInput, MAX_EXPERIENCE_YEARS);
            const increaseCount = getCount(increaseInput);
            const referralCount = getCount(referralInput);
            const rateUp = (experienceYears + increaseCount + referralCount) * 0.01;

            // リファラル手当（0人の場合は非表示）
            const referralAllowance = referralCount * REFERRAL_ALLOWANCE;
            if (referralCount > 0) {
                referralAllowanceDiv.textContent = `リファラル手当：1人あたり+20万円 × ${referralCount}人 = +${formatCurrency(referralAllowance)} 支給`;
                referralAllowanceDiv.style.display = 'block';
                annualAllowanceDiv.textContent = '+手当 ' + formatCurrency(referralAllowance);
                annualAllowanceDiv.style.display = 'block';
            } else {
                referralAllowanceDiv.style.display = 'none';
                annualAllowanceDiv.style.display = 'none';
            }

            if (unitPrice > 0) {
                // 還元率UP分は会社利益から差し引く（会社利益は0未満にしない）
                const companyProfit = Math.max(Math.min(unitPrice * 0.2, 100000) - unitPrice * rateUp, 0);
                const returnTotal = unitPrice - companyProfit;

                // ── 収束計算 ──────────────────────────────────────
                // 額面は「還元総額 - 会社負担社保」だが、
                // 会社負担社保の雇用保険は額面に依存するため反復で収束させる
                // 標準報酬月額は還元総額ではなく額面給与から求める
                const { salary, std } = solveSalary(returnTotal, isOver40);

                const { workerTotal, companyTotal } = calcSyaho(std, salary, isOver40);
                const annualSalary = salary * 12;
                const takeDome = salary - workerTotal; // 手取り

                returnTotalSpan.textContent = formatCurrency(returnTotal);
                salarySpan.textContent = formatCurrency(salary);
                companyProfitSpan.textContent = formatCurrency(companyProfit);
                annualSalarySpan.textContent = formatCurrency(annualSalary);

                // 他社事例も同様に収束計算
                function calcCompSalary(rate) {
                    return solveSalary(unitPrice * rate, isOver40).salary;
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
    });
})();

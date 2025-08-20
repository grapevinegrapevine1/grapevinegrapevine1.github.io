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

        function calculateSalary() {
            const unitPrice = parseFloat(unitPriceInput.value) || 0;
            if (unitPrice > 0) {
                const companyProfit = Math.min(unitPrice * 0.2, 100000);
                const returnTotal = unitPrice - companyProfit;
                const baseSalary = 260000;
                const syaho = Math.round(baseSalary * 0.04955 + baseSalary * 0.0915 + baseSalary * 0.0036 + unitPrice * 0.01);
                const salary = returnTotal - syaho;
                const annualSalary = salary * 12;
                
                returnTotalSpan.textContent = formatCurrency(returnTotal);
                salarySpan.textContent = formatCurrency(salary);
                companyProfitSpan.textContent = formatCurrency(companyProfit);
                annualSalarySpan.textContent = formatCurrency(annualSalary);

                const comp80Salary = unitPrice * 0.8 * 0.85;
                const comp70Salary = unitPrice * 0.7 * 0.85;
                const comp60Salary = unitPrice * 0.6 * 0.85;
                const comp50Salary = unitPrice * 0.5 * 0.85;

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
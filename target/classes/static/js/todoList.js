
// ページが読み込まれたときに実行される関数
document.addEventListener("DOMContentLoaded", function() {
	console.log('Todo List アプリが読み込まれました');
	
	// 各種機能を初期化
	initializeInputEffects();
	initializeTableInteractions();
	initializeFormValidation();
	initializeFloatingButtn();
});

/*
 * 入力フィールドのマテリアルデザイン効果を初期化
 */
function initializeInputEffects() {
	// 全ての入力フィールドを取得
	const inputs = document.querySelectorAll('.matrial-input, material-selet');
	
	// 各入力フィールドにイベントリスナーを追加
	inputs.forEach(function(input) {
		// フォーカス時の効果
		input.addEventListener('focus', function() {
			this.style.transform = 'scale(1.02)';
			this.style.transition = 'all 0.3s ease';
		});
		// 入力値が変更された時の効果
		input.addEventListener('input', function() {
			if(this.value.length > 0) {
				this.style.bordercolor = '#4caf50';
			} else {
				this.style.bordercolor = '#e0e0e0';
			}
		});
	});
}
/**
 * テーブルの行にホバー効果とクリック効果を追加
 */
function initializeTableInteractions() {
	const todoRows = document.querySelectorAll('.todo-row');
	
	todoRows.forEach(function(row) {
		// マウスが行に入った時
		row.addEventListener('mouseenter', function() {
			if (!this.classList.contains('completed')) {
				this.style.backgroundColor = '#e3f2fd';
				this.style.transform = 'translatex(5px)';
				this.style.transition = 'all 0.3s ease';
			}
		});
		
		// マウスが行から出た時
		row.addEventListener('mouseleave', function() {
			if(!this.classList.contains('completed')) {
				this.style.backgroundColor = '';
				this.style.transform = 'translatex(0)';
			}
		});
		// 行をクリックした時のリップル効果
		row.addEventListener('click', function(event) {
			// リンクをクリックした場合は何もしない
			if (event.target.tagName === 'A') {
				return;
			}
			
			// リップル効果を作成
			createRippleEffect(this, event);
		});
	});
}
/**
 * リップル効果を作成する関数
 */
function createRippleEffect(element, event) {
	// 既存のリップルがあれば削除
	const existingRipple = element.querySelector('.ripple');
	if (existingRipple) {
		existingRipple.remove();
	}
	
	// リップル要素を作成
	const ripple = document.createElement('span');
	ripple.classList.add('ripple');
	
	// リップルのサイズを計算
	const rect = element.getBoundingClientRect();
	const size = Math.max(rect.width, rect.height);
	const x = event.clientX - rect.left - size / 2;
	const y = event.clientY - rect.top - size / 2;
	
	// リップルのスタイルを設定
	ripple.style.width = ripple.style.height = size + 'px';
	ripple.style.left = x + 'px';
	ripple.style.position = 'absolute';
	ripple.style.borderRadius = '50%';
	ripple.style.transform = 'scale(0)';
	ripple.style.animation = 'ripple-animation 0.6s linear';
	ripple.style.pointerEvents = 'none';
	
	// 相対位置を設定
	element.style.position = 'relative';
	element.style.overflow = 'hidden';
	
	// リップルを要素に追加
	element.appendChild(ripple);
	
	// アニメーション終了後にリップルを削除
	setTimeout(function() {
		ripple.remove();
	}, 600);
}

/** 
 * フォームバリデーション機能
 */
function initializeFormValidation() {
    const form = document.querySelector('form');
    const deadlineFromInput = document.querySelector('input[name="deadlineFrom"]');
    const deadlineToInput = document.querySelector('input[name="deadlineTo"]');
    
    if (form && deadlineFromInput && deadlineToInput) {
        // フォーム送信時のバリデーション
        form.addEventListener('submit', function(event) {
            const fromDate = new Date(deadlineFromInput.value);
            const toDate = new Date(deadlineToInput.value);
            
            // 日付の整合性をチェック
            if (deadlineFromInput.value && deadlineToInput.value) {
                if (fromDate > toDate) {
                    event.preventDefault();
                    showErrorMessage('開始日は終了日より前の日付を選択してください');
                    return false;
                }
            }
            
            // 成功メッセージを表示
            showSuccessMessage('検索を実行中...');
        });
        
        // 日付入力時のリアルタイムバリデーション
        deadlineFromInput.addEventListener('change', validateDateRange);
        deadlineToInput.addEventListener('change', validateDateRange);
    }
}

/**
 * 日付範囲のバリデーション
 */
function validateDateRange() {
    const deadlineFromInput = document.querySelector('input[name="deadlineFrom"]');
    const deadlineToInput = document.querySelector('input[name="deadlineTo"]');
    
    if (deadlineFromInput.value && deadlineToInput.value) {
        const fromDate = new Date(deadlineFromInput.value);
        const toDate = new Date(deadlineToInput.value);
        
        if (fromDate > toDate) {
            deadlineFromInput.style.borderColor = '#f44336';
            deadlineToInput.style.borderColor = '#f44336';
        } else {
            deadlineFromInput.style.borderColor = '#4caf50';
            deadlineToInput.style.borderColor = '#4caf50';
        }
    }
}

/**
 * フローティングアクションボタンの機能
 */
function initializeFloatingButton() {
    const fabButton = document.querySelector('.btn-fab');
    
    if (fabButton) {
        // スクロール時の効果
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                fabButton.style.transform = 'scale(1.1)';
                fabButton.style.boxShadow = '0 8px 30px rgba(255, 64, 129, 0.4)';
            } else {
                fabButton.style.transform = 'scale(1)';
                fabButton.style.boxShadow = '0 4px 20px rgba(255, 64, 129, 0.3)';
            }
        });
        
        // クリック時のフィードバック
        fabButton.addEventListener('click', function() {
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
            }, 100);
        });
    }
}

/**
 * エラーメッセージを表示する関数
 */
function showErrorMessage(message) {
    const errorContainer = document.querySelector('.error-messages');
    if (!errorContainer) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.opacity = '0';
    errorDiv.style.transform = 'translateY(-10px)';
    
    errorContainer.appendChild(errorDiv);
    
    // アニメーション効果
    setTimeout(function() {
        errorDiv.style.transition = 'all 0.3s ease';
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // 5秒後に自動削除
    setTimeout(function() {
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateY(-10px)';
        setTimeout(function() {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 300);
    }, 5000);
}

/**
 * 成功メッセージを表示する関数
 */
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        font-weight: 500;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    // アニメーション効果
    setTimeout(function() {
        successDiv.style.opacity = '1';
        successDiv.style.transform = 'translateX(0)';
    }, 10);
    
    // 3秒後に自動削除
    setTimeout(function() {
        successDiv.style.opacity = '0';
        successDiv.style.transform = 'translateX(100px)';
        setTimeout(function() {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

/**
 * テーブルの行をクリックした時の詳細表示
 */
function showTaskDetails(taskId) {
    // 実際のアプリケーションでは、ここでタスクの詳細を表示
    console.log('タスクID ' + taskId + ' の詳細を表示');
}

/**
 * キーボードショートカット機能
 */
document.addEventListener('keydown', function(event) {
    // Ctrl + Enter で検索実行
    if (event.ctrlKey && event.key === 'Enter') {
        const searchButton = document.querySelector('button[type="submit"]');
        if (searchButton) {
            searchButton.click();
        }
    }
    
    // Ctrl + N で新規追加
    if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        const addButton = document.querySelector('.btn-fab');
        if (addButton) {
            addButton.click();
        }
    }
    
    // Escape でフォームをクリア
    if (event.key === 'Escape') {
        clearForm();
    }
});

/**
 * フォームをクリアする関数
 */
function clearForm() {
    const inputs = document.querySelectorAll('.material-input');
    const selects = document.querySelectorAll('.material-select');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    inputs.forEach(function(input) {
        input.value = '';
        input.style.borderColor = '#e0e0e0';
    });
    
    selects.forEach(function(select) {
        select.selectedIndex = 0;
    });
    
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    
    showSuccessMessage('フォームをクリアしました');
}

/**
 * ローディング表示機能
 */
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 40px;
        height: 40px;
        border: 4px solid #e0e0e0;
        border-top: 4px solid #1976d2;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    loadingDiv.appendChild(spinner);
    document.body.appendChild(loadingDiv);
}

/**
 * ローディングを非表示にする
 */
function hideLoading() {
    const loadingDiv = document.getElementById('loading-overlay');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// CSS アニメーションをJavaScriptで追加
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// ページ読み込み完了時の処理
window.addEventListener('load', function() {
    // カードにフェードインアニメーションを追加
    const cards = document.querySelectorAll('.search-card, .todo-list-card');
    cards.forEach(function(card, index) {
        setTimeout(function() {
            card.classList.add('fade-in');
        }, index * 200);
    });
    
    console.log('すべてのリソースが読み込まれました');
});
document.addEventListener('DOMContentLoaded', function() {
	// 期限切れタスクの処理
	const today = new Date();
	today.setHours(0,0,0,0); // 時間をリセット
	
	const todoRows = document.querySelectorAll('.todo-row');
	
	todoRows.forEach(row => {
		const deadlineCell = row.querySelector('.todo-deadline');
		const deadlineText = deadlineCell.textContent.trim();
		const isCompleted = row.classList.contains('completed');
		
		if (deadlineText && deadlineText !== '未設定' && !isCompleted) {
			const deadlineDate = new Date(deadlineText);
			deadlineDate.setHours(0,0,0,0);
			
			if (deadlineDate < today) {
				// 期限切れ
				row.classList.add('overdue');
				deadlineCell.innerHTML = `
				<div class="deadline overdue">
					<i class="material-icons">warning</i>
					<span>${deadlineText}</span><br>
					<small class="overdue-text">期限切れ</small>
				</div>`;
			} else if (deadlineDate.getTime() === today.getTime()) {
				// 今日期限
				row.classList.add('today-deadline');
				deadlineCell.innerHTML = `
					<div class="deadline today">
						<i class="material-icons">today</i>
						<span>${deadlineText}</span><br>
						<small class="today-text">今日期限</small>
					</div>`;
			}
		}
	})
})
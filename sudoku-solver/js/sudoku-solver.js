var grid = [];

$(document).ready(function() {
	$("input[type='tel']").attr("maxlength", "1");
	$("#solve-button").click(function() {
		solveSudoku();
	});
	$("#reset-button").click(function() {
		resetGrid();
	});
	$("#solve-button").removeAttr("disabled");
	resetGrid();
});

function clearContents() {
	$("input[type='tel']").val("");
}

function clearStoredValues() {
	for (var i = 1; i <= 9; i++) {
		grid[i] = [];
	}
}

function resetFontWeight() {
	$("input[type='tel']").css("font-weight", "normal");
	$("input[type='tel']").css("font-size", "20px");
}

function resetGrid() {
	clearContents();
	resetFontWeight();
	clearStoredValues();
	$("#solve-button").removeAttr("disabled");
}

function readGrid() {
	$("input[type='tel']").each(function() {
		var cellId = this.id;
		var i = Math.floor(cellId / 10);
		var j = cellId % 10;
		if (this.value == "") {
			grid[i][j] = 0;
		} else {
			grid[i][j] = this.value;
		}
	});
}

function makeFontBold() {
	$("input[type='tel']").each(function() {
		if (this.value != "") {
			$(this).css("font-weight", "bold");
			$(this).css("font-size", "24px");
		}
	});
}

function renderGrid() {
	$("input[type='tel']").each(function() {
		var cellId = this.id;
		var i = Math.floor(cellId / 10);
		var j = cellId % 10;
		this.value = grid[i][j];
	});
}

function displaySolution() {
	makeFontBold();
	renderGrid();
	$("#solve-button").attr("disabled", "disabled");
}

function findEmptyCell() {
	for (var i = 1; i <= 9; i++) {
		for (var j = 1; j <= 9; j++) {
			if (grid[i][j] == 0) {
				return (10 * i + j);
			}
		}
	}
	return -1;
}

function usedInRow(num, row, col) {
	for (var j = 1; j <= 9; j++) {
		if (j != col && grid[row][j] == num) {
			return true;
		}
	}
	return false;
}

function usedInCol(num, row, col) {
	for (var i = 1; i <= 9; i++) {
		if (i != row && grid[i][col] == num) {
			return true;
		}
	}
	return false;
}

function usedInBox(num, row, col) {
	var startI = (3 * Math.floor((row - 1) / 3) + 1);
	var startJ = (3 * Math.floor((col - 1) / 3) + 1);
	var endI = startI + 2;
	var endJ = startJ + 2;
	for (var i = startI; i <= endI; i++) {
		for (var j = startJ; j <= endJ; j++) {
			if (!(i == row && j == col) && num == grid[i][j]) {
				return true;
			}
		}
	}
	return false;
}

function safeToPut(num, row, col) {
	if (num == 0) {
		return true;
	}
	if (usedInRow(num, row, col) || usedInCol(num, row, col) || usedInBox(num, row, col)) {
		return false;
	}
	return true;
}

function solutionExists() {
	var cellId = findEmptyCell();
	if (cellId == -1) {
		return true;
	}
	var row = Math.floor(cellId / 10);
	var col = cellId % 10;
	for (var num = 1; num <= 9; num++) {
		if (safeToPut(num, row, col)) {
			grid[row][col] = num;
			if (solutionExists()) {
				return true;
			}
			grid[row][col] = 0;
		}
	}
	return false;
}

function solve() {
	if (solutionExists()) {
		displaySolution();
	} else {
		$("#unsolvable-sudoku-modal").modal("show");
	}
}

function checkValidity() {
	for (var i = 1; i <= 9; i++) {
		for (var j = 1; j <= 9; j++) {
			var num = grid[i][j];
			if (!safeToPut(num, i, j)) {
				return false;
			}
		}
	}
	return true;
}

function checkSolvability() {
	var filledCount = 0;
	for (var i = 1; i <= 9; i++) {
		for (var j = 1; j <= 9; j++) {
			if (grid[i][j] != 0) {
				filledCount++;
			}
		}
	}
	if (filledCount > 16) {
		return true;
	}
	return false;
}

function solveSudoku() {
	readGrid();
	if (checkSolvability()) {
		if (checkValidity()) {
			solve();
		} else {
			$("#invalid-sudoku-input-modal").modal("show");
		}
	} else {
		$("#minimum-not-met-modal").modal("show");
	}
}

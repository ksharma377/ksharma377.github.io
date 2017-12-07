var grid = [];
var emptyCells = [];

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
	emptyCells = [];
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
	emptyCells = [];
	$("input[type='tel']").each(function() {
		var cellId = this.id;
		var i = Math.floor(cellId / 10);
		var j = cellId % 10;
		if (this.value == "") {
			grid[i][j] = 0;
			var obj = {};
			obj.row = i;
			obj.col = j;
			obj.possibilities = [];
			emptyCells[emptyCells.length] = obj;
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

function solutionExists(index) {
	if (index < 0) {
		return true;
	}
	var row = emptyCells[index].row;
	var col = emptyCells[index].col;
	for (var i = 0, len = emptyCells[index].possibilities.length; i < len; i++) {
		var num = emptyCells[index].possibilities[i];
		if (safeToPut(num, row, col)) {
			grid[row][col] = num;
			if (solutionExists(index - 1)) {
				return true;
			}
			grid[row][col] = 0;
		}
	}
	return false;
}

function getPossibilities(row, col) {
	var possibilities = [];
	var count = 0;
	for (var num = 1; num <= 9; num++) {
		if (safeToPut(num, row, col)) {
			possibilities[count] = num;
			count++;
		}
	}
	return possibilities;
}

function preprocess() {
	for (var i = 0, len = emptyCells.length; i < len; i++) {
		emptyCells[i].possibilities = getPossibilities(emptyCells[i].row, emptyCells[i].col);
	}
	emptyCells.sort(function(a, b) {
		return (b.possibilities.length - a.possibilities.length);
	});
}

function solve() {
	preprocess();
	if (solutionExists(emptyCells.length - 1)) {
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

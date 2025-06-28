package com.example.todolist.form;

import lombok.Data;

@Data
public class TodoQuery {
	
	// 変数宣言
	private String title;
	private Integer importance;
	private Integer urgency;
	private String deadlineFrom;
	private String deadlineTo;
	private String done;
	
	public TodoQuery() {
		// 変数の初期化
		title = "";
		importance = -1;
		urgency = -1;
		deadlineFrom = "";
		deadlineTo = "";
		done = "";
	}
}

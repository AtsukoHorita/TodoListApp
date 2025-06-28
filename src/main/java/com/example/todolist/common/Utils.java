package com.example.todolist.common;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class Utils {
	
	// 日付フォーマットを指定 (例: yyyy-MM-dd形式)
	// このフォーマットを使用して文字列から日付に変換する
	private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	
	/**
	 * 指定された形式の文字列を java.sql.Date 型に変換するユーティリティメソッド。
	 * @param s 日付文字列 (例: "2025-06-11")。フォーマットは yyyy-MM-dd である必要があります。
	 * @return java.sql.Date オブジェクト。引数で指定された日付を表します。
	 * @throws IllegalArgumentException 入力文字列が yyyy-MM-dd フォーマットに一致しない場合。
	 */
	public static Date str2date(String s) {
		try {
			long ms = sdf.parse(s).getTime();
			return new Date(ms);
		} catch (ParseException e) {
			throw new IllegalArgumentException(
					"Invalid date format.Expeted yyyy-MM-dd.",e);
		}
	}
}

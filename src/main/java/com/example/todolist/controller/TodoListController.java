package com.example.todolist.controller;

import java.util.List;

import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import com.example.todolist.entity.Todo;
import com.example.todolist.form.TodoData;
import com.example.todolist.form.TodoQuery;
import com.example.todolist.repository.TodoRepository;
import com.example.todolist.service.TodoService;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class TodoListController {
	
	// Todoエンティティにアクセスするためのリポジトリを定義
	// （依存性注入による初期化）
	private final TodoRepository todoRepository;
	
	private final HttpSession session;
	
	
	/**
	 * // Todoに関するビジネスロジックを処理するサービスクラスを定義
	 * （依存性注入による初期化）
	 */
	private final TodoService todoService;
	
	// ToDo一覧表示
	@GetMapping("/todo")
	public ModelAndView showTodoList(ModelAndView mv) {
		// 一覧を検索して表示する
		mv.setViewName("todoList");
		List<Todo> todoList = todoRepository.findAll();
		
		mv.addObject("todoList", todoList);
		mv.addObject("todoQuery", new TodoQuery());
		
		return mv;
	}
	
	// ToDo入力フォーム表示
	// 処理：ToDo一覧画面(todoList.html)で[新規追加]リンクがクリックされたとき
	@GetMapping("/todo/create")
	public ModelAndView createTodo(ModelAndView mv) {
		// 遷移先
		mv.setViewName("todoForm");
		// 新しいTodoを入力するための空のデータを準備
		mv.addObject("todoData", new TodoData());
		
		session.setAttribute("mode", "create");
		return mv;
	}

	// ToDo一覧画面（todoList.html)で[登録]ボタンがクリックされた時
	@PostMapping("/todo/create")
	public String createTodo(
			@ModelAttribute @Validated TodoData todoData,
			BindingResult result,
			ModelAndView mv) {
		// エラーチェック
		boolean isValid = todoService.isValid(todoData, result);
		if (!result.hasErrors() && isValid) {
			// エラーなしの場合
			Todo todo = todoData.toEntity();
			todoRepository.saveAndFlush(todo);
			return "redirect:/todo";
		} else {
			// エラーあり
			mv.setViewName("todoForm");
			
			// mv.addObject("todoData", todoData);
			return "todoForm";
		}
	}
	
	// ToDo一覧へ戻る
	// ToDo入力画面で[キャンセル登録]ボタンがクリックされた時
	@PostMapping("/todo/cancel")
	public String cancel() {
			return "redirect:/todo";
	}
	
	// 指定されたIDのToDoデータを取得し、フォーム画面に表示するメソッド
	@GetMapping("/todo/{id}")
	public ModelAndView todoById(
			// URLパスからToDoのIDを取得
			@PathVariable(name="id")int id,
			ModelAndView mv) {
		
		// 表示するビュー(HTMLファイル)を指定
		mv.setViewName("todoForm");
		
		// 指定されたIDのTodoデータをデータベースから検索
		// findById(id): IDをキーにしてデータを取得
		// .get(): Optional型の値を取得する
		Todo todo = todoRepository.findById(id).get();
		
		mv.addObject("todoData", todo);
		
		session.setAttribute("mode", "update");
		
		return mv;
	}
	
	// レコードを更新するメソッド
	@PostMapping("/todo/update")
	public String updateTodo(
		@ModelAttribute @Validated TodoData todoData,
		BindingResult result,
		Model model) {
		
		// エラーチェック
		boolean isValid = todoService.isValid(todoData, result);
		if (!result.hasErrors() && isValid) {
			// エラーなし
			Todo todo = todoData.toEntity();
			todoRepository.saveAndFlush(todo);
			
			return "redirect:/todo";
		} else {
			// エラーあり
			return "todoForm";
		}
	}
	
	// レコードを削除するメソッド
	@PostMapping("/todo/delete")
	public String deleteTodo(
		@ModelAttribute TodoData todoData) {
		
		todoRepository.deleteById(todoData.getId());
		
		// 画面遷移(todoへ)
		return "redirect:/todo";
	}
	
	@PostMapping("/todo/query")
	public ModelAndView queryTodo(@ModelAttribute TodoQuery todoQuery,
			BindingResult result,
			ModelAndView mv) {
		mv.setViewName("todoList");
		List<Todo> todoList = null;
		if (todoService.isValid(todoQuery, result)) {
			
			// エラーがなければ検索
			todoList = todoService.doQuery(todoQuery);
		}
		// mv.addObject("todoQuery", todoQuery);
		mv.addObject("todoList", todoList);
		
		return mv;
	}
}

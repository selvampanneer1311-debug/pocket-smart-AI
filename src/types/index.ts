export type AppTab =
  | 'landing'
  | 'dashboard'
  | 'home-planner'
  | 'party-planner'
  | 'jewelry-planner'
  | 'history'
  | 'login'
  | 'register';

export interface User {
  username: string;
  email?: string;
  fullName?: string;
  isLoggedIn: boolean;
}

export interface ShoppingLinks {
  [platform: string]: string;
}

export interface BudgetItem {
  name: string;
  description: string;
  estimated_price: number;
  quantity: number;
  search_terms: string;
  shopping_links?: ShoppingLinks;
}

export interface BudgetCategory {
  category: string;
  allocation: number;
  items: BudgetItem[];
}

export interface CalculationTableRow {
  category: string;
  items_count: number;
  total_cost: number;
  percentage_of_budget: number;
}

export interface HomePlanResult {
  total_budget: number;
  currency: string;
  remaining_budget: number;
  budget_breakdown: BudgetCategory[];
  calculation_table: CalculationTableRow[];
  additional_suggestions: string[];
}

export interface VenueSuggestion {
  name: string;
  type: string;
  capacity: number;
  estimated_cost: number;
  search_terms: string;
  shopping_links?: ShoppingLinks;
}

export interface PartyPlanResult {
  total_budget: number;
  currency: string;
  remaining_budget: number;
  budget_breakdown: BudgetCategory[];
  calculation_table_inr: CalculationTableRow[];
  venue_suggestions: VenueSuggestion[];
  additional_suggestions: string[];
}

export interface OutfitAnalysis {
  colors: string[];
  style: string;
  formality: string;
  notes?: string;
}

export interface JewelryItem {
  item_type: string;
  name: string;
  description: string;
  style: string;
  estimated_price: number;
  search_terms: string;
  shopping_links?: ShoppingLinks;
}

export interface JewelryPlanResult {
  total_budget: number;
  currency: string;
  remaining_budget: number;
  outfit_analysis?: OutfitAnalysis;
  jewelry_recommendations: JewelryItem[];
  styling_tips: string[];
}

export interface HistoryRecord {
  id: string;
  type: 'home' | 'party' | 'jewelry';
  timestamp: string;
  username: string;
  total_budget: number;
  currency: string;
  remaining_budget: number;
  input_summary: string;
  summary: string;
  full_result: any;
}

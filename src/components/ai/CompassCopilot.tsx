import { useState, useEffect } from "react";
import { Sparkles, X, MessageSquare, TrendingUp, AlertTriangle, Users, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

interface CompassCopilotProps {
  currentTab: string;
  filters: any;
}

export function CompassCopilot({ currentTab, filters }: CompassCopilotProps) {
  const { user, canViewResource } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [contextSummary, setContextSummary] = useState<any[]>([]);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  // Update context when tab or filters change
  useEffect(() => {
    updateContext();
  }, [currentTab, filters, user?.role]);

  const updateContext = () => {
    const summary = generateContextSummary();
    const prompts = generateSuggestedPrompts();
    setContextSummary(summary);
    setSuggestedPrompts(prompts);
  };

  const generateContextSummary = () => {
    const summaries = [];

    switch (currentTab) {
      case 'overview':
        if (canViewResource('executive-overview')) {
          summaries.push({
            icon: TrendingUp,
            title: "Portfolio Performance",
            value: "94.2% occupancy",
            status: "positive",
            description: "2.1% above target"
          });
          summaries.push({
            icon: AlertTriangle,
            title: "Active Alerts",
            value: "7 communities",
            status: "warning",
            description: "Below census targets"
          });
        }
        break;
      
      case 'census':
        if (canViewResource('census-occupancy')) {
          summaries.push({
            icon: Users,
            title: "Total Census",
            value: "12,847 residents",
            status: "neutral",
            description: "Across 156 communities"
          });
          summaries.push({
            icon: TrendingUp,
            title: "Move-in Pipeline",
            value: "342 prospects",
            status: "positive",
            description: "15% increase from last month"
          });
        }
        break;
      
      case 'financial':
        if (canViewResource('financial-health')) {
          summaries.push({
            icon: TrendingUp,
            title: "Revenue Performance",
            value: "$24.3M monthly",
            status: "positive",
            description: "3.2% above forecast"
          });
          summaries.push({
            icon: AlertTriangle,
            title: "Collections Risk",
            value: "$890K outstanding",
            status: "warning",
            description: "Requires attention"
          });
        }
        break;
      
      case 'sales':
        if (canViewResource('sales-pipeline')) {
          summaries.push({
            icon: Users,
            title: "Active Prospects",
            value: "1,247 leads",
            status: "positive",
            description: "22% conversion rate"
          });
          summaries.push({
            icon: TrendingUp,
            title: "Tour Activity",
            value: "89 scheduled",
            status: "neutral",
            description: "This week"
          });
        }
        break;
      
      case 'care':
        if (canViewResource('care-compliance')) {
          summaries.push({
            icon: AlertTriangle,
            title: "Compliance Alerts",
            value: "3 active",
            status: "warning",
            description: "Medication management"
          });
        }
        break;
      
      case 'forecast':
        if (canViewResource('forecast-risk')) {
          summaries.push({
            icon: TrendingUp,
            title: "Risk Score",
            value: "Medium",
            status: "warning",
            description: "Market volatility factors"
          });
        }
        break;
    }

    return summaries;
  };

  const generateSuggestedPrompts = () => {
    const prompts = [];

    switch (currentTab) {
      case 'overview':
        prompts.push(
          "What's driving the occupancy improvement this quarter?",
          "Which regions are underperforming and why?",
          "Show me communities at risk of missing targets"
        );
        break;
      
      case 'census':
        prompts.push(
          "Why is census dropping in specific regions?",
          "What's the average length of stay trend?",
          "Which communities have the strongest move-in rates?"
        );
        break;
      
      case 'financial':
        prompts.push(
          "Explain the revenue variance from budget",
          "Which cost centers are over budget?",
          "What's driving the AR aging trend?"
        );
        break;
      
      case 'sales':
        prompts.push(
          "Why is conversion rate declining?",
          "Which lead sources perform best?",
          "Show me tour-to-move-in analysis"
        );
        break;
      
      case 'care':
        prompts.push(
          "What are the most common compliance issues?",
          "Which communities need care plan reviews?",
          "Show me medication management trends"
        );
        break;
      
      case 'forecast':
        prompts.push(
          "What factors contribute to the current risk level?",
          "Which markets show the highest volatility?",
          "Show me scenario planning outcomes"
        );
        break;
    }

    // Add role-specific prompts
    if (user?.role === 'sales') {
      prompts.push("Show me sales team performance metrics");
    } else if (user?.role === 'regional-ops') {
      prompts.push("Highlight operational efficiency opportunities");
    } else if (user?.role === 'admin') {
      prompts.push("Show system-wide performance indicators");
    }

    return prompts.slice(0, 4); // Limit to 4 suggestions
  };

  const generateAIResponse = (question: string) => {
    const responses: Record<string, string> = {
      "What's driving the occupancy improvement this quarter?": 
        `Based on your portfolio data, the 2.1% occupancy improvement this quarter is primarily driven by:\n\n• **Strong Move-in Activity**: 15% increase in successful tours converting to move-ins\n• **Reduced Turnover**: Average length of stay increased by 8.3 months\n• **Market Recovery**: Post-pandemic demand stabilization in key metros\n• **Pricing Optimization**: Strategic rate adjustments in 23 communities\n\n**Key Contributors:**\n- Northeast Region: +3.2% occupancy (strongest performer)\n- Premium AL communities: 97.8% average occupancy\n- Memory care units: 94.1% occupancy, +$347 RPOU\n\nRecommendation: Focus expansion efforts in Northeast markets and replicate pricing strategies from top-performing communities.`,
      
      "Which regions are underperforming and why?":
        `Analysis shows 3 regions below portfolio average:\n\n**Southeast Region** (89.2% occupancy, -2.8% vs target)\n• Challenge: Oversupply from 4 new competitor openings\n• Impact: 12 communities affected, $1.2M revenue gap\n• Action: Aggressive pricing + enhanced amenities\n\n**Mountain West** (91.4% occupancy, -1.6% vs target)\n• Challenge: Seasonal resident patterns + economic headwinds\n• Impact: Higher winter departures, slower spring absorption\n• Action: Develop retention programs for Q1-Q2\n\n**Southwest** (92.1% occupancy, -0.9% vs target)\n• Challenge: Skilled nursing competition for higher-acuity residents\n• Impact: Lost 47 potential AL placements to SNF\n• Action: Enhance clinical services positioning`,
      
      "Show me communities at risk of missing targets":
        `**High-Risk Communities (7 total)**\n\n🔴 **Immediate Attention (Next 30 days)**\n• Sunset Manor (TX): 78.2% occupancy, needs 8 move-ins\n• Garden View (FL): 81.4% occupancy, needs 6 move-ins\n• Heritage Court (CO): 79.8% occupancy, needs 7 move-ins\n\n🟡 **Monitor Closely (Next 60 days)**\n• Maple Ridge (GA): 86.1% occupancy, trending down\n• Valley Springs (AZ): 87.3% occupancy, slow tours\n• Riverside Plaza (NC): 85.9% occupancy, pricing pressure\n\n**Common Risk Factors:**\n- New competition within 3-mile radius\n- Above-market pricing (avg +$290/month)\n- Insufficient marketing spend (<$2.1K/month)\n- Staffing challenges affecting service quality`,
      
      "Why is census dropping in specific regions?":
        `**Census Decline Analysis by Region:**\n\n**Southeast Region** (-3.2% QoQ)\n• Primary: 4 new competitor facilities opened\n• Secondary: Hurricane impact delayed 23 move-ins\n• Tertiary: 2 communities under renovation\n\n**Mountain West** (-1.8% QoQ)\n• Seasonal migration patterns (winter departures)\n• Economic uncertainty affecting family decisions\n• Delayed family relocations due to housing market\n\n**Root Cause Deep Dive:**\n- 68% of departures: Health status changes requiring higher care\n- 22% of departures: Financial constraints (family-related)\n- 10% of departures: Dissatisfaction with services\n\n**Mitigation Strategy:**\n- Accelerate clinical service partnerships\n- Implement sliding fee scale programs\n- Enhance resident/family engagement`,
      
      "What's the average length of stay trend?":
        `**Length of Stay Analysis (Rolling 12 months):**\n\n📈 **Positive Trends:**\n• Overall LOS increased to 28.4 months (+8.3% YoY)\n• Memory Care: 31.2 months (+12.1% YoY)\n• AL Plus: 26.8 months (+6.4% YoY)\n\n**Segmentation Insights:**\n• **Entry Age 75-84**: 32.1 months average LOS\n• **Entry Age 85+**: 22.7 months average LOS\n• **Private Pay**: 29.8 months vs. **Medicaid**: 24.1 months\n\n**Drivers of Increased LOS:**\n- Enhanced wellness programming\n- Improved clinical partnerships\n- Family engagement initiatives\n- Technology adoption (telehealth)\n\n**Impact on Revenue:**\n- $2.3M additional revenue from LOS improvement\n- Reduced turnover costs by $890K annually\n- Marketing efficiency up 23% (fewer needed move-ins)`,
      
      "Explain the revenue variance from budget":
        `**Revenue Variance Analysis (YTD):**\n\n**Favorable Variance: +$1.47M (+3.2%)**\n\n🟢 **Positive Contributors:**\n• Rate optimization: +$2.1M (avg +$127/resident/month)\n• Occupancy improvement: +$890K (94.2% vs 92.8% budget)\n• Ancillary services: +$340K (care coordination fees)\n• One-time community fees: +$180K\n\n🔴 **Negative Contributors:**\n• Bad debt increase: -$1.2M (3.2% vs 2.1% budgeted)\n• Concessions/discounts: -$430K (competitive pressure)\n• Delayed rate increases: -$210K (family pushback)\n\n**Key Insights:**\n- Premium communities outperforming by 4.8%\n- Value-tier properties lagging by 1.2%\n- Memory care generating highest margin growth\n\n**Q4 Forecast:** Continue tracking 2.8% above budget if current trends hold`,
      
      "Show me sales team performance metrics":
        `**Sales Team Performance Dashboard:**\n\n**Portfolio Metrics (Q3 2024):**\n• Tours Scheduled: 1,247 (+18% vs Q2)\n• Tour-to-Move-in: 22.3% (+1.8% vs Q2)\n• Average Sales Cycle: 14.2 days (-2.1 days vs Q2)\n• Lead Response Time: 2.1 hours (target: <2 hours)\n\n**Top Performers:**\n🥇 **Sarah Chen** (Northeast): 34% conversion, 89 tours\n🥈 **Mike Rodriguez** (West): 31% conversion, 76 tours\n🥉 **Lisa Park** (Central): 28% conversion, 82 tours\n\n**Improvement Opportunities:**\n• Southeast team: 16% conversion (needs coaching)\n• Weekend coverage: Only 67% of leads contacted\n• Follow-up consistency: 23% of prospects need nurturing\n\n**Recommendations:**\n- Additional training for Southeast team\n- Implement weekend rotation schedule\n- Deploy automated nurture sequences`
    };

    return responses[question] || "I'll analyze your data and provide insights based on your current dashboard context and applied filters. This would be a detailed response specific to your question.";
  };

  const simulateTyping = (text: string) => {
    setIsTyping(true);
    setCurrentResponse("");
    
    // Simulate typing effect
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        setCurrentResponse(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 20);
  };

  const handlePromptClick = (prompt: string) => {
    setCurrentQuestion(prompt);
    const response = generateAIResponse(prompt);
    simulateTyping(response);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    
    setCurrentQuestion(inputValue);
    const response = generateAIResponse(inputValue);
    simulateTyping(response);
    setInputValue("");
  };

  const getTabDisplayName = () => {
    const tabNames = {
      'overview': 'Executive Overview',
      'census': 'Census & Occupancy',
      'sales': 'Sales & Pipeline',
      'financial': 'Financial Health',
      'care': 'Care & Compliance',
      'forecast': 'Forecast & Risk'
    };
    return tabNames[currentTab as keyof typeof tabNames] || 'Dashboard';
  };

  return (
    <>
      {/* Floating Action Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          >
            <Sparkles className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="right" className="w-96 sm:w-[400px] p-0">
          <SheetHeader className="p-6 pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Compass Copilot
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              AI insights for {getTabDisplayName()}
            </p>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {/* Context Summary Cards */}
            <div className="p-6 space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Current Insights</h4>
              {contextSummary.map((item, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <item.icon className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{item.title}</p>
                          <Badge variant={
                            item.status === 'positive' ? 'default' :
                            item.status === 'warning' ? 'destructive' : 'secondary'
                          }>
                            {item.value}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Response Area */}
            {currentResponse && (
              <div className="px-6 pb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Bot className="h-4 w-4" />
                    <span>Compass Copilot</span>
                    {isTyping && <span className="animate-pulse">●</span>}
                  </div>
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="text-sm font-medium mb-2 text-primary">
                        {currentQuestion}
                      </div>
                      <ScrollArea className="h-64">
                        <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                          {currentResponse}
                          {isTyping && <span className="animate-pulse bg-primary w-2 h-4 inline-block ml-1"></span>}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Suggested Prompts */}
            {suggestedPrompts.length > 0 && !currentResponse && (
              <div className="px-6 pb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Suggested Questions</h4>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start h-auto p-3 text-wrap"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="text-xs">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* New Question Button */}
            {currentResponse && (
              <div className="px-6 pb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setCurrentResponse("");
                    setCurrentQuestion("");
                  }}
                >
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Ask Another Question
                </Button>
              </div>
            )}

            {/* Input Section */}
            <div className="mt-auto p-6 border-t border-border">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about your data..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSubmit}
                    disabled={!inputValue.trim()}
                    size="sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ask questions about your current view and applied filters
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
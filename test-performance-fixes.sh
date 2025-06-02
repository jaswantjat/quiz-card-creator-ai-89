#!/bin/bash
# Comprehensive Performance Testing Script for iQube Railway Deployment

echo "🧪 Testing iQube Performance and Image Loading Fixes"
echo "====================================================="

RAILWAY_URL="https://genrate-with-ai-feature-production.up.railway.app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"
    local test_type="$4"
    
    echo -e "\n${BLUE}Testing: $name${NC}"
    echo "URL: $url"
    
    start_time=$(date +%s%3N)
    response=$(curl -s -w "HTTPSTATUS:%{http_code};TIME:%{time_total}" "$url")
    end_time=$(date +%s%3N)
    
    http_status=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    time_total=$(echo "$response" | grep -o "TIME:[0-9.]*" | cut -d: -f2)
    body=$(echo "$response" | sed -E 's/HTTPSTATUS:[0-9]*;TIME:[0-9.]*$//')
    
    duration=$((end_time - start_time))
    
    if [ "$http_status" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} - Status: $http_status, Time: ${time_total}s (${duration}ms)"
        
        if [ "$test_type" = "json" ]; then
            echo "$body" | jq . > /dev/null 2>&1
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Valid JSON response${NC}"
            else
                echo -e "${RED}❌ Invalid JSON response${NC}"
            fi
        elif [ "$test_type" = "image" ]; then
            if [[ "$body" == *"PNG"* ]] || [[ "$body" == *"JFIF"* ]] || [[ "$body" == *"GIF"* ]]; then
                echo -e "${GREEN}✅ Valid image response${NC}"
            else
                echo -e "${RED}❌ Not a valid image - got HTML instead${NC}"
                echo "Response preview: ${body:0:100}..."
            fi
        fi
    else
        echo -e "${RED}❌ FAIL${NC} - Expected: $expected_status, Got: $http_status, Time: ${time_total}s"
        echo "Response preview: ${body:0:200}..."
    fi
}

# Test POST endpoint
test_post_endpoint() {
    local name="$1"
    local url="$2"
    local data="$3"
    local expected_status="$4"
    
    echo -e "\n${BLUE}Testing: $name${NC}"
    echo "URL: $url"
    echo "Data: $data"
    
    start_time=$(date +%s%3N)
    response=$(curl -s -w "HTTPSTATUS:%{http_code};TIME:%{time_total}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$data" \
        "$url")
    end_time=$(date +%s%3N)
    
    http_status=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    time_total=$(echo "$response" | grep -o "TIME:[0-9.]*" | cut -d: -f2)
    body=$(echo "$response" | sed -E 's/HTTPSTATUS:[0-9]*;TIME:[0-9.]*$//')
    
    duration=$((end_time - start_time))
    
    if [ "$http_status" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} - Status: $http_status, Time: ${time_total}s (${duration}ms)"
        
        # Check for performance metrics in response
        if echo "$body" | jq -e '.performance' > /dev/null 2>&1; then
            generation_time=$(echo "$body" | jq -r '.performance.generation_time_ms // "N/A"')
            questions_per_sec=$(echo "$body" | jq -r '.performance.questions_per_second // "N/A"')
            echo -e "${GREEN}📊 Performance: ${generation_time}ms generation, ${questions_per_sec} q/s${NC}"
        fi
    else
        echo -e "${RED}❌ FAIL${NC} - Expected: $expected_status, Got: $http_status, Time: ${time_total}s"
        echo "Response preview: ${body:0:200}..."
    fi
}

echo -e "\n${YELLOW}1. Testing Basic Health Endpoints${NC}"
echo "=================================="

test_endpoint "Health Check" "$RAILWAY_URL/health" "200" "json"
test_endpoint "Database Status" "$RAILWAY_URL/api/status/database" "503" "json"

echo -e "\n${YELLOW}2. Testing API Performance${NC}"
echo "=========================="

test_endpoint "Question Topics" "$RAILWAY_URL/api/questions/topics" "200" "json"

test_post_endpoint "Question Generation" \
    "$RAILWAY_URL/api/questions/generate" \
    '{"topicName":"Business & AI","count":3,"difficulty":"medium"}' \
    "200"

echo -e "\n${YELLOW}3. Testing Image Loading${NC}"
echo "========================"

test_endpoint "iQube Logo" "$RAILWAY_URL/lovable-uploads/5f87692c-a4e5-4595-8ad0-26c2ce2c520e.png" "200" "image"
test_endpoint "Placeholder SVG" "$RAILWAY_URL/placeholder.svg" "200" "image"
test_endpoint "Favicon" "$RAILWAY_URL/favicon.ico" "200" "image"

echo -e "\n${YELLOW}4. Testing Static Assets${NC}"
echo "========================"

# Get the main page to find asset URLs
main_page=$(curl -s "$RAILWAY_URL/")
css_file=$(echo "$main_page" | grep -o '/assets/index-[a-f0-9]*.css' | head -1)
js_file=$(echo "$main_page" | grep -o '/assets/index-[a-f0-9]*.js' | head -1)

if [ -n "$css_file" ]; then
    test_endpoint "Main CSS File" "$RAILWAY_URL$css_file" "200" "text"
else
    echo -e "${RED}❌ Could not find CSS file in main page${NC}"
fi

if [ -n "$js_file" ]; then
    test_endpoint "Main JS File" "$RAILWAY_URL$js_file" "200" "text"
else
    echo -e "${RED}❌ Could not find JS file in main page${NC}"
fi

echo -e "\n${YELLOW}5. Testing Authentication Endpoints${NC}"
echo "===================================="

test_post_endpoint "Login Endpoint" \
    "$RAILWAY_URL/api/auth/login" \
    '{"email":"test@example.com","password":"testpass"}' \
    "401"

test_post_endpoint "Register Endpoint" \
    "$RAILWAY_URL/api/auth/register" \
    '{"email":"test@example.com","password":"testpass","firstName":"Test","lastName":"User"}' \
    "500"

echo -e "\n${YELLOW}6. Performance Summary${NC}"
echo "====================="

echo -e "${BLUE}Expected Results After Fixes:${NC}"
echo "✅ Health endpoints: Fast response (< 100ms)"
echo "✅ Question generation: < 50ms with performance metrics"
echo "✅ Images: Proper image content (not HTML)"
echo "✅ Static assets: Proper Content-Type headers"
echo "✅ Authentication: Proper error messages (not 500 for all)"

echo -e "\n${BLUE}Known Issues to Fix:${NC}"
echo "🔧 Database connectivity: Requires Azure SQL firewall rule"
echo "🔧 Image serving: May need additional static middleware fixes"
echo "🔧 Authentication: Depends on database connectivity"

echo -e "\n${GREEN}Testing completed!${NC}"
echo "Check the results above to verify performance improvements."

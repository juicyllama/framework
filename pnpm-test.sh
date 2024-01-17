## INSTALL PACKAGES##

directories=(
    ### COMMON ###
    "common/cli"
    "common/dev"
    "common/utils"
    
    ### FRONTEND ###
    "frontend/core"
    "frontend/vue-dev"
    "frontend/vue-utils"
    
    ### BACKEND ###
    "backend/core"
    "backend/crm"
    "backend/app-store"
    "backend/ai"
    "backend/billing"
    "backend/data-cache"
    "backend/websites"
    "backend/ecommerce"
    
    ### APPS ###
    "apps/apilayer"
    "apps/aws"
    "apps/everflow"
    "apps/google"
    "apps/mailchimp"
    "apps/mollie"
    "apps/openai"
    "apps/pexels"
    "apps/scrapingbee"
    "apps/shopify"
    "apps/slack"
    "apps/wise"
    "apps/wordpress"
    "apps/xero-cc"
    )


# Initialize counters
success_count=0
failure_count=0
declare -a failed_directories

# Loop through each directory and run 'pnpm run test'
for dir in "${directories[@]}"; do
    echo "Running tests in $dir..."
    output=$(cd "$dir" && pnpm run test 2>&1)
    exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo "Tests succeeded in $dir"
        ((success_count++))
    else
        if [[ "$output" != *ERR_PNPM_NO_SCRIPT* ]]; then
        ((failure_count++))
        failed_directories+=("$dir")
            echo "Tests failed in $dir, displaying output:"
            echo "$output"
        else
            echo "No test script found, skipping"
        fi
        
    fi
done

# Print summary
echo "Summary:"
echo "Successes: $success_count"
echo "Failures: $failure_count"
if [ $failure_count -ne 0 ]; then
    echo "Failed in directories:"
    printf " - %s\n" "${failed_directories[@]}"
fi
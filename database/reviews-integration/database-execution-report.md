================================================================================
TOUR REVIEWS DATABASE EXECUTION REPORT
================================================================================
Execution Date: 2025-08-24T21:00:50.088Z
Total Duration: 27 seconds

EXECUTION SUMMARY:
- Total reviews inserted: 0
- Total errors: 6
- Languages processed: 5
- Success rate: 0%

LANGUAGE BREAKDOWN:
- EN: 0 inserted, 2 errors, 9s
- DE: 0 inserted, 1 errors, 5s
- FR: 0 inserted, 1 errors, 4s
- ES: 0 inserted, 1 errors, 4s
- AR: 0 inserted, 1 errors, 5s

VALIDATION RESULTS:
- EN: 72 total reviews in database
- DE: 25 total reviews in database
- FR: 25 total reviews in database
- ES: 11 total reviews in database
- AR: 8 total reviews in database
- Data integrity issues: NO

CONFIGURATION:
- Batch size: 50
- Retry attempts: 3
- Execution order: en, de, fr, es, ar

FILES PROCESSED:
- en: complete-english-reviews.json
- de: complete-german-reviews.json
- fr: complete-french-reviews.json
- es: complete-spanish-reviews.json
- ar: complete-arabic-reviews.json

DETAILED ERRORS:

EN ERRORS:
1. Batch 1: invalid input syntax for type uuid: "en-bb-001"
2. Batch 2: invalid input syntax for type uuid: "en-st-003"

DE ERRORS:
1. Batch 1: invalid input syntax for type uuid: "de-bb-001"

FR ERRORS:
1. Batch 1: invalid input syntax for type uuid: "fr-bb-001"

ES ERRORS:
1. Batch 1: invalid input syntax for type uuid: "es-bb-001"

AR ERRORS:
1. Batch 1: invalid input syntax for type uuid: "ar-bb-001"
================================================================================
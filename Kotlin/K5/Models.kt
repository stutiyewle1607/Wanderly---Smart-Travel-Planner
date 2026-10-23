// --------------------------------------------------
// Base Class: Traveler
// --------------------------------------------------

open class Traveler(
    val travelerId: String,
    val name: String,
    val email: String,
    val age: Int,
    val interests: Set<String>
) {

    // Default Wanderly planning fee
    open fun calculatePlanningFee(): Double {
        return 1000.0
    }

    // Returns traveler details
    open fun getDetails(): String {
        return "[ID: $travelerId] Name: $name | Category: General | Fee: ₹${calculatePlanningFee()}"
    }
}


// --------------------------------------------------
// Subclass 1: Student Traveler
// --------------------------------------------------

class StudentTraveler(
    travelerId: String,
    name: String,
    email: String,
    age: Int,
    interests: Set<String>,
    val collegeName: String,
    val isStudentMember: Boolean
) : Traveler(
    travelerId,
    name,
    email,
    age,
    interests
) {

    // Student travelers receive a discount
    override fun calculatePlanningFee(): Double {

        val discountRate = if (isStudentMember) 0.30 else 0.10

        return 1000.0 * (1.0 - discountRate)
    }

    override fun getDetails(): String {
        return "[ID: $travelerId] Name: $name | Category: Student | Fee: ₹${calculatePlanningFee()}"
    }
}


// --------------------------------------------------
// Subclass 2: Professional Traveler
// --------------------------------------------------

class ProfessionalTraveler(
    travelerId: String,
    name: String,
    email: String,
    age: Int,
    interests: Set<String>,
    val companyName: String
) : Traveler(
    travelerId,
    name,
    email,
    age,
    interests
) {

    // Professional travelers have an additional service charge
    override fun calculatePlanningFee(): Double {

        val corporateSurcharge = 500.0

        return 1000.0 + corporateSurcharge
    }

    override fun getDetails(): String {
        return "[ID: $travelerId] Name: $name | Category: Professional | Fee: ₹${calculatePlanningFee()}"
    }
}
package br.com.senai.mylibrary.loan;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    @Query(
        """
        select l from Loan l
        join fetch l.book b
        order by l.loanDate desc, l.id desc
        """
    )
    List<Loan> findAllWithBook();

    @Query(
        """
        select l from Loan l
        join fetch l.book b
        where l.actualReturnDate is null
        order by l.expectedReturnDate asc, l.loanDate asc, l.id asc
        """
    )
    List<Loan> findActiveWithBook();

    @Query(
        """
        select l from Loan l
        join fetch l.book b
        where b.id = :bookId
        order by l.loanDate desc, l.id desc
        """
    )
    List<Loan> findByBookIdWithBook(@Param("bookId") Long bookId);

    @Query(
        """
        select l from Loan l
        join fetch l.book b
        where l.id = :id
        """
    )
    Optional<Loan> findByIdWithBook(@Param("id") Long id);

    boolean existsByBookIdAndActualReturnDateIsNull(Long bookId);
}
